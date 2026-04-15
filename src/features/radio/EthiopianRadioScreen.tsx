import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useRadioApp } from '@/features/radio/useRadioApp';
import type { PlaybackPhase, RadioStation } from '@/features/radio/types';

function formatSleepTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function EthiopianRadioScreen() {
  const {
    currentStation,
    cycleSleepTimer,
    error,
    favorites,
    featuredStations,
    isLoading,
    isRefreshing,
    playbackPhase,
    playStation,
    refreshStations,
    searchQuery,
    setSearchQuery,
    showFavoritesOnly,
    setShowFavoritesOnly,
    sleepRemainingSeconds,
    sleepTimerMinutes,
    stations,
    toggleFavorite,
    togglePlayback,
  } = useRadioApp();

  const isPlaying = playbackPhase === 'playing';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.flagStrip}>
        <View style={styles.flagGreen} />
        <View style={styles.flagYellow} />
        <View style={styles.flagRed} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refreshStations} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>🇪🇹 Live Ethiopian Radio</Text>
          <Text style={styles.heroTitle}>Ethio Radio</Text>
          <Text style={styles.heroBody}>
            Stream Ethiopian stations with a clean, mobile-first listening
            experience built around discovery, favorites, and quick playback.
          </Text>

          <View style={styles.heroStats}>
            <InfoChip label="Stations" value={`${stations.length}`} />
            <InfoChip label="Favorites" value={`${favorites.length}`} />
            <InfoChip label="Now" value={playbackLabel(playbackPhase)} />
          </View>
        </View>

        <View style={styles.searchCard}>
          <TextInput
            onChangeText={setSearchQuery}
            placeholder="Search stations, languages, or tags"
            placeholderTextColor="#8C96A8"
            style={styles.searchInput}
            value={searchQuery}
          />
          <View style={styles.filterRow}>
            <FilterPill
              active={!showFavoritesOnly}
              label="All Stations"
              onPress={() => setShowFavoritesOnly(false)}
            />
            <FilterPill
              active={showFavoritesOnly}
              label="Favorites"
              onPress={() => setShowFavoritesOnly(true)}
            />
          </View>
        </View>

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Connection issue</Text>
            <Text style={styles.errorBody}>{error}</Text>
            <Pressable onPress={refreshStations} style={styles.retryButton}>
              <Text style={styles.retryLabel}>Try again</Text>
            </Pressable>
          </View>
        ) : null}

        <SectionHeader
          title="Featured"
          subtitle="Quick picks for popular Ethiopian stations"
        />

        <ScrollView
          contentContainerStyle={styles.featuredRow}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {(featuredStations.length > 0 ? featuredStations : stations.slice(0, 6)).map(
            (station) => (
              <FeaturedStationCard
                isActive={currentStation?.id === station.id}
                key={station.id}
                onPress={() => void playStation(station)}
                station={station}
              />
            ),
          )}
        </ScrollView>

        <SectionHeader
          title="Browse"
          subtitle="Search by station name, language, and local tags"
        />

        {isLoading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color="#D4A843" size="large" />
            <Text style={styles.loadingLabel}>Loading Ethiopian stations...</Text>
          </View>
        ) : (
          <View style={styles.stationList}>
            {stations.map((station) => (
              <StationRow
                isActive={currentStation?.id === station.id}
                isFavorite={favorites.includes(station.id)}
                key={station.id}
                onFavorite={() => void toggleFavorite(station.id)}
                onPress={() => void playStation(station)}
                station={station}
              />
            ))}
            {!stations.length ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No stations found</Text>
                <Text style={styles.emptyBody}>
                  Try a broader search or switch back to all stations.
                </Text>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>

      <View style={styles.playerBar}>
        <View style={styles.playerMeta}>
          <Text numberOfLines={1} style={styles.playerStation}>
            {currentStation?.title ?? 'Choose a station'}
          </Text>
          <Text numberOfLines={1} style={styles.playerSubtitle}>
            {currentStation?.subtitle ?? 'Tap a featured station to start listening'}
          </Text>
        </View>
        <Pressable onPress={cycleSleepTimer} style={styles.sleepTimerButton}>
          <Text
            style={[
              styles.sleepTimerLabel,
              sleepTimerMinutes > 0 ? styles.sleepTimerLabelActive : undefined,
            ]}
          >
            {sleepTimerMinutes > 0 ? formatSleepTimer(sleepRemainingSeconds) : 'ZZZ'}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => void togglePlayback()}
          style={[styles.playerButton, isPlaying ? styles.playerButtonPlaying : undefined]}
        >
          <Text style={styles.playerButtonLabel}>{playerButtonLabel(playbackPhase)}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function SectionHeader({ subtitle, title }: { subtitle: string; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    </View>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoChip}>
      <Text style={styles.infoChipValue}>{value}</Text>
      <Text style={styles.infoChipLabel}>{label}</Text>
    </View>
  );
}

function FilterPill({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.filterPill, active ? styles.filterPillActive : undefined]}
    >
      <Text
        style={[
          styles.filterPillLabel,
          active ? styles.filterPillLabelActive : undefined,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function FeaturedStationCard({
  isActive,
  onPress,
  station,
}: {
  isActive: boolean;
  onPress: () => void;
  station: RadioStation;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.featuredCard, isActive ? styles.featuredCardActive : undefined]}
    >
      <StationArtwork station={station} />
      <Text numberOfLines={1} style={styles.featuredTitle}>
        {station.title}
      </Text>
      <Text numberOfLines={2} style={styles.featuredSubtitle}>
        {station.subtitle}
      </Text>
      {station.language ? (
        <View style={styles.languagePill}>
          <Text style={styles.languagePillText}>{station.language}</Text>
        </View>
      ) : null}
      <Text style={styles.featuredMeta}>{station.votes} votes</Text>
    </Pressable>
  );
}

function StationRow({
  isActive,
  isFavorite,
  onFavorite,
  onPress,
  station,
}: {
  isActive: boolean;
  isFavorite: boolean;
  onFavorite: () => void;
  onPress: () => void;
  station: RadioStation;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.stationRow, isActive ? styles.stationRowActive : undefined]}
    >
      <StationArtwork station={station} />
      <View style={styles.stationCopy}>
        <Text numberOfLines={1} style={styles.stationTitle}>
          {station.title}
        </Text>
        <Text numberOfLines={1} style={styles.stationSubtitle}>
          {station.subtitle}
        </Text>
        {station.language ? (
          <View style={styles.stationLanguageChip}>
            <Text style={styles.stationLanguageChipText}>{station.language}</Text>
          </View>
        ) : null}
      </View>
      <Pressable
        onPress={(event) => {
          event.stopPropagation();
          onFavorite();
        }}
        style={styles.stationFavoriteButton}
      >
        <Text
          style={[
            styles.stationFavoriteLabel,
            isFavorite ? styles.stationFavoriteLabelActive : undefined,
          ]}
        >
          {isFavorite ? '♥' : '♡'}
        </Text>
      </Pressable>
    </Pressable>
  );
}

function StationArtwork({ station }: { station: RadioStation }) {
  if (station.favicon) {
    return <Image source={{ uri: station.favicon }} style={styles.stationArtwork} />;
  }

  return (
    <View style={styles.stationArtworkFallback}>
      <Text style={styles.stationArtworkLetter}>{station.title.slice(0, 1)}</Text>
    </View>
  );
}

function playbackLabel(playbackPhase: PlaybackPhase): string {
  switch (playbackPhase) {
    case 'playing':
      return 'Live';
    case 'loading':
      return 'Buffering';
    case 'paused':
      return 'Paused';
    case 'error':
      return 'Error';
    default:
      return 'Ready';
  }
}

function playerButtonLabel(playbackPhase: PlaybackPhase): string {
  if (playbackPhase === 'loading') {
    return '...';
  }

  if (playbackPhase === 'playing') {
    return 'Pause';
  }

  return 'Play';
}

const styles = StyleSheet.create({
  emptyBody: {
    color: '#8C96A8',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#0F1520',
    borderColor: '#1A2235',
    borderRadius: 22,
    borderWidth: 1,
    gap: 8,
    padding: 24,
  },
  emptyTitle: {
    color: '#F5F0E8',
    fontSize: 18,
    fontWeight: '700',
  },
  errorBody: {
    color: '#F5F0E8',
    fontSize: 14,
    lineHeight: 20,
  },
  errorCard: {
    backgroundColor: '#6b2d27',
    borderRadius: 24,
    gap: 10,
    padding: 18,
  },
  errorTitle: {
    color: '#F5F0E8',
    fontSize: 18,
    fontWeight: '700',
  },
  eyebrow: {
    color: '#D4A843',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  featuredCard: {
    backgroundColor: '#0F1520',
    borderBottomColor: '#FCDD09',
    borderBottomWidth: 3,
    borderColor: '#1A2235',
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    padding: 16,
    width: 240,
  },
  featuredCardActive: {
    borderColor: '#078930',
    shadowColor: '#078930',
    shadowOpacity: 0.18,
    shadowRadius: 18,
  },
  featuredMeta: {
    color: '#D4A843',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  featuredRow: {
    gap: 14,
    paddingRight: 20,
  },
  featuredSubtitle: {
    color: '#8C96A8',
    fontSize: 14,
    lineHeight: 20,
  },
  featuredTitle: {
    color: '#F5F0E8',
    fontSize: 20,
    fontWeight: '700',
  },
  filterPill: {
    backgroundColor: '#1A2235',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterPillActive: {
    backgroundColor: '#D4A843',
  },
  filterPillLabel: {
    color: '#F5F0E8',
    fontSize: 13,
    fontWeight: '700',
  },
  filterPillLabelActive: {
    color: '#0F1520',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
  },
  flagGreen: {
    backgroundColor: '#078930',
    flex: 1,
  },
  flagRed: {
    backgroundColor: '#DA121A',
    flex: 1,
  },
  flagStrip: {
    flexDirection: 'row',
    height: 4,
  },
  flagYellow: {
    backgroundColor: '#FCDD09',
    flex: 1,
  },
  heroBody: {
    color: '#8C96A8',
    fontSize: 15,
    lineHeight: 22,
  },
  heroCard: {
    backgroundColor: '#0F1520',
    borderLeftColor: '#078930',
    borderLeftWidth: 4,
    borderRadius: 28,
    gap: 14,
    overflow: 'hidden',
    padding: 22,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 6,
  },
  heroTitle: {
    color: '#F5F0E8',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  infoChip: {
    backgroundColor: '#1A2235',
    borderRadius: 18,
    flex: 1,
    gap: 2,
    padding: 12,
  },
  infoChipLabel: {
    color: '#8C96A8',
    fontSize: 12,
  },
  infoChipValue: {
    color: '#F5F0E8',
    fontSize: 18,
    fontWeight: '700',
  },
  languagePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#1A2235',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  languagePillText: {
    color: '#8C96A8',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  loadingCard: {
    alignItems: 'center',
    backgroundColor: '#0F1520',
    borderColor: '#1A2235',
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    padding: 28,
  },
  loadingLabel: {
    color: '#8C96A8',
    fontSize: 15,
  },
  playerBar: {
    alignItems: 'center',
    backgroundColor: '#0A0F18',
    borderColor: '#1A2235',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  playerButton: {
    alignItems: 'center',
    backgroundColor: '#D4A843',
    borderRadius: 999,
    minWidth: 88,
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  playerButtonLabel: {
    color: '#0F1520',
    fontSize: 15,
    fontWeight: '800',
  },
  playerButtonPlaying: {
    backgroundColor: '#078930',
  },
  playerMeta: {
    flex: 1,
    gap: 4,
  },
  playerStation: {
    color: '#F5F0E8',
    fontSize: 16,
    fontWeight: '700',
  },
  playerSubtitle: {
    color: '#8C96A8',
    fontSize: 13,
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F0E8',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  retryLabel: {
    color: '#6b2d27',
    fontSize: 13,
    fontWeight: '700',
  },
  safeArea: {
    backgroundColor: '#080C12',
    flex: 1,
  },
  scrollContent: {
    gap: 18,
    paddingBottom: 120,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  searchCard: {
    backgroundColor: '#0F1520',
    borderColor: '#1A2235',
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#0F1520',
    borderColor: '#1A2235',
    borderRadius: 18,
    borderWidth: 1,
    color: '#F5F0E8',
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionSubtitle: {
    color: '#8C96A8',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#F5F0E8',
    fontSize: 22,
    fontWeight: '800',
  },
  sleepTimerButton: {
    alignItems: 'center',
    backgroundColor: '#1A2235',
    borderRadius: 999,
    justifyContent: 'center',
    minWidth: 56,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  sleepTimerLabel: {
    color: '#8C96A8',
    fontSize: 12,
    fontWeight: '700',
  },
  sleepTimerLabelActive: {
    color: '#FCDD09',
  },
  stationArtwork: {
    backgroundColor: '#F5F0E8',
    borderRadius: 18,
    height: 56,
    width: 56,
  },
  stationArtworkFallback: {
    alignItems: 'center',
    backgroundColor: '#D4A843',
    borderRadius: 18,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  stationArtworkLetter: {
    color: '#0F1520',
    fontSize: 24,
    fontWeight: '800',
  },
  stationCopy: {
    flex: 1,
    gap: 4,
  },
  stationFavoriteButton: {
    alignItems: 'center',
    backgroundColor: '#1A2235',
    borderRadius: 999,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  stationFavoriteLabel: {
    color: '#8C96A8',
    fontSize: 18,
    fontWeight: '700',
  },
  stationFavoriteLabelActive: {
    color: '#DA121A',
  },
  stationLanguageChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#1A2235',
    borderRadius: 999,
    marginTop: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  stationLanguageChipText: {
    color: '#8C96A8',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  stationList: {
    gap: 12,
  },
  stationRow: {
    alignItems: 'center',
    backgroundColor: '#0F1520',
    borderColor: '#1A2235',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 14,
  },
  stationRowActive: {
    borderColor: '#078930',
  },
  stationSubtitle: {
    color: '#8C96A8',
    fontSize: 14,
  },
  stationTitle: {
    color: '#F5F0E8',
    fontSize: 17,
    fontWeight: '700',
  },
});
