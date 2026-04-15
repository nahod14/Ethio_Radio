import { create } from 'zustand';

import type { PlaybackPhase, RadioStation } from '@/features/radio/types';

interface RadioState {
  currentStation: RadioStation | null;
  error: string | null;
  favorites: string[];
  featuredStations: RadioStation[];
  isLoading: boolean;
  isRefreshing: boolean;
  playbackPhase: PlaybackPhase;
  searchQuery: string;
  showFavoritesOnly: boolean;
  stations: RadioStation[];
  sleepTimerMinutes: number;
  sleepRemainingSeconds: number;
}

interface RadioActions {
  setCurrentStation: (station: RadioStation | null) => void;
  setError: (error: string | null) => void;
  setFavorites: (favorites: string[]) => void;
  setFeaturedStations: (stations: RadioStation[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsRefreshing: (isRefreshing: boolean) => void;
  setPlaybackPhase: (phase: PlaybackPhase) => void;
  setSearchQuery: (query: string) => void;
  setShowFavoritesOnly: (show: boolean) => void;
  setStations: (stations: RadioStation[]) => void;
  setSleepTimerMinutes: (minutes: number) => void;
  setSleepRemainingSeconds: (seconds: number) => void;
}

export type RadioStore = RadioState & RadioActions;

export const useRadioStore = create<RadioStore>((set) => ({
  // State
  currentStation: null,
  error: null,
  favorites: [],
  featuredStations: [],
  isLoading: true,
  isRefreshing: false,
  playbackPhase: 'idle',
  searchQuery: '',
  showFavoritesOnly: false,
  stations: [],
  sleepTimerMinutes: 0,
  sleepRemainingSeconds: 0,

  // Actions
  setCurrentStation: (station) => set({ currentStation: station }),
  setError: (error) => set({ error }),
  setFavorites: (favorites) => set({ favorites }),
  setFeaturedStations: (stations) => set({ featuredStations: stations }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsRefreshing: (isRefreshing) => set({ isRefreshing }),
  setPlaybackPhase: (phase) => set({ playbackPhase: phase }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setShowFavoritesOnly: (show) => set({ showFavoritesOnly: show }),
  setStations: (stations) => set({ stations }),
  setSleepTimerMinutes: (minutes) => set({ sleepTimerMinutes: minutes }),
  setSleepRemainingSeconds: (seconds) => set({ sleepRemainingSeconds: seconds }),
}));
