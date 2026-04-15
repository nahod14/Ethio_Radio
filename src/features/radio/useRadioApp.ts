import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { useEffect, useMemo, useRef } from 'react';
import type { MutableRefObject } from 'react';

import { fetchEthiopianStations } from '@/features/radio/radioService';
import { filterStations } from '@/features/radio/radioUtils';
import type { RadioStation } from '@/features/radio/types';
import { useRadioStore } from '@/store/radioStore';

const FAVORITES_STORAGE_KEY = 'ethio-radio:favorites';
const SLEEP_TIMER_OPTIONS = [0, 15, 30, 60, 90] as const;

export function useRadioApp() {
  const {
    currentStation,
    error,
    favorites,
    featuredStations,
    isLoading,
    isRefreshing,
    playbackPhase,
    searchQuery,
    showFavoritesOnly,
    stations,
    sleepTimerMinutes,
    sleepRemainingSeconds,
    setCurrentStation,
    setError,
    setFavorites,
    setFeaturedStations,
    setIsLoading,
    setIsRefreshing,
    setPlaybackPhase,
    setSearchQuery,
    setShowFavoritesOnly,
    setStations,
    setSleepTimerMinutes,
    setSleepRemainingSeconds,
  } = useRadioStore();

  const soundRef = useRef<Audio.Sound | null>(null);
  const sleepIntervalRef: MutableRefObject<ReturnType<typeof setInterval> | null> =
    useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    void Audio.setAudioModeAsync({
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
    });

    void hydrateFavorites();
    void loadStations();

    return () => {
      void unloadSound(soundRef);

      if (sleepIntervalRef.current !== null) {
        clearInterval(sleepIntervalRef.current);
        sleepIntervalRef.current = null;
      }
    };
  }, []);

  async function hydrateFavorites() {
    try {
      const rawValue = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);

      if (!rawValue) {
        return;
      }

      const parsed = JSON.parse(rawValue) as unknown;

      if (Array.isArray(parsed)) {
        setFavorites(parsed.filter((value): value is string => typeof value === 'string'));
      }
    } catch {
      setFavorites([]);
    }
  }

  async function loadStations(isManualRefresh = false) {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError(null);

    try {
      const data = await fetchEthiopianStations();
      setFeaturedStations(data.featuredStations);
      setStations(data.stations);

      if (!currentStation && data.stations.length > 0) {
        setCurrentStation(data.featuredStations[0] ?? data.stations[0]);
      } else if (currentStation) {
        const refreshedCurrent = data.stations.find(
          (station) => station.id === currentStation.id,
        );

        if (refreshedCurrent) {
          setCurrentStation(refreshedCurrent);
        }
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load Ethiopian radio stations right now.',
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  async function playStation(station: RadioStation) {
    setCurrentStation(station);
    setPlaybackPhase('loading');
    setError(null);

    try {
      await unloadSound(soundRef);

      const { sound } = await Audio.Sound.createAsync(
        { uri: station.streamUrl },
        { shouldPlay: true },
        (status) => {
          if (!status.isLoaded) {
            if (status.error) {
              setPlaybackPhase('error');
              setError(status.error);
            }
            return;
          }

          if (status.isBuffering) {
            setPlaybackPhase('loading');
            return;
          }

          setPlaybackPhase(status.isPlaying ? 'playing' : 'paused');
        },
      );

      soundRef.current = sound;
    } catch (playError) {
      setPlaybackPhase('error');
      setError(
        playError instanceof Error
          ? playError.message
          : 'Unable to start this station.',
      );
    }
  }

  async function togglePlayback() {
    const sound = soundRef.current;

    if (!currentStation) {
      const firstStation = featuredStations[0] ?? stations[0];

      if (firstStation) {
        await playStation(firstStation);
      }
      return;
    }

    if (!sound) {
      await playStation(currentStation);
      return;
    }

    const status = await sound.getStatusAsync();

    if (!status.isLoaded) {
      await playStation(currentStation);
      return;
    }

    if (status.isPlaying) {
      await sound.pauseAsync();
      setPlaybackPhase('paused');
      return;
    }

    await sound.playAsync();
    setPlaybackPhase('playing');
  }

  async function toggleFavorite(stationId: string) {
    const nextFavorites = favorites.includes(stationId)
      ? favorites.filter((id) => id !== stationId)
      : [...favorites, stationId];

    setFavorites(nextFavorites);
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites));
  }

  async function refreshStations() {
    await loadStations(true);
  }

  function cycleSleepTimer() {
    const currentIndex = SLEEP_TIMER_OPTIONS.indexOf(
      sleepTimerMinutes as (typeof SLEEP_TIMER_OPTIONS)[number],
    );
    const nextIndex = (currentIndex + 1) % SLEEP_TIMER_OPTIONS.length;
    const nextMinutes = SLEEP_TIMER_OPTIONS[nextIndex] ?? 0;

    if (sleepIntervalRef.current !== null) {
      clearInterval(sleepIntervalRef.current);
      sleepIntervalRef.current = null;
    }

    setSleepTimerMinutes(nextMinutes);

    if (nextMinutes === 0) {
      setSleepRemainingSeconds(0);
      return;
    }

    const totalSeconds = nextMinutes * 60;
    setSleepRemainingSeconds(totalSeconds);

    let remaining = totalSeconds;

    sleepIntervalRef.current = setInterval(() => {
      remaining -= 1;
      setSleepRemainingSeconds(remaining);

      if (remaining <= 0) {
        if (sleepIntervalRef.current !== null) {
          clearInterval(sleepIntervalRef.current);
          sleepIntervalRef.current = null;
        }

        setSleepTimerMinutes(0);
        setSleepRemainingSeconds(0);

        const sound = soundRef.current;
        if (sound) {
          void sound.pauseAsync().then(() => {
            setPlaybackPhase('paused');
          });
        } else {
          setPlaybackPhase('paused');
        }
      }
    }, 1000);
  }

  const visibleStations = useMemo(
    () => filterStations(stations, searchQuery, favorites, showFavoritesOnly),
    [favorites, searchQuery, showFavoritesOnly, stations],
  );

  return {
    currentStation,
    cycleSleepTimer,
    error,
    favorites,
    featuredStations,
    isLoading,
    isRefreshing,
    playbackPhase,
    refreshStations,
    searchQuery,
    setSearchQuery,
    showFavoritesOnly,
    setShowFavoritesOnly,
    sleepRemainingSeconds,
    sleepTimerMinutes,
    stations: visibleStations,
    toggleFavorite,
    togglePlayback,
    playStation,
  };
}

async function unloadSound(soundRef: MutableRefObject<Audio.Sound | null>) {
  const sound = soundRef.current;

  if (!sound) {
    return;
  }

  soundRef.current = null;
  await sound.unloadAsync();
}
