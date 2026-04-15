import type { RadioBrowserStation, RadioStation } from '@/features/radio/types';

const FEATURED_NAMES = ['ebs', 'ebc', 'ethio fm', 'fana', 'sheger', 'bisrat', 'ahadu'];

/**
 * Radio Browser often stores a stale Zeno edge (e.g. stream-25.zeno.fm). The canonical
 * host redirects to a working edge with a fresh token — better for expo-av playback.
 */
function resolveStreamUrl(raw: RadioBrowserStation, title: string): string {
  const base = safeTrim(raw.url_resolved) || safeTrim(raw.url);
  const t = title.toLowerCase();

  if (t.includes('ebc') && t.includes('national')) {
    // Stream from https://liveonlineradio.net/ebc-national-radio (data-stream on page)
    return 'https://stream.zeno.fm/ad402tap7yzuv';
  }

  return base;
}

/** Same display name from Radio Browser with different stream URLs — keep highest votes. */
function dedupeStationsByTitle(stations: RadioStation[]): RadioStation[] {
  const byTitle = new Map<string, RadioStation>();

  for (const station of stations) {
    const key = station.title.toLowerCase();
    const existing = byTitle.get(key);
    if (!existing || station.votes > existing.votes) {
      byTitle.set(key, station);
    }
  }

  return Array.from(byTitle.values());
}

/** Stations to hide (name/tag/genre), per product request. */
function isBlockedStation(station: RadioStation): boolean {
  const title = station.title.toLowerCase();
  const subtitle = station.subtitle.toLowerCase();
  const tagBlob = station.tags.join(' ').toLowerCase();
  const blob = `${title} ${subtitle} ${tagBlob}`;

  if (blob.includes('mirt') && blob.includes('internet')) {
    return true;
  }

  if (title.includes('yonjon')) {
    return true;
  }

  if (
    station.title.includes('اذاعة القرآن') ||
    station.title.includes('القرآن الكريم')
  ) {
    return true;
  }

  if (/hip[-\s]?hop/i.test(blob)) {
    return true;
  }

  if (/\bjazz\b/i.test(blob) || title.includes('jazz')) {
    return true;
  }

  if (/\bhalaal\b/i.test(blob) || /\bhalal\s+(media|radio)\b/i.test(blob)) {
    return true;
  }

  if (blob.includes('kan reka')) {
    return true;
  }

  if (blob.includes('abdulbasit') || blob.includes('abdulsamad')) {
    return true;
  }

  if (blob.includes('sheger365') || /\bsheger\s*365\b/i.test(blob)) {
    return true;
  }

  if (/\bfm\s+addis/i.test(title) && /97\.1/.test(title)) {
    return true;
  }

  if (blob.includes('daily hype')) {
    return true;
  }

  if (blob.includes('ethio oldies')) {
    return true;
  }

  if (/\bmusic\b/i.test(title)) {
    return true;
  }

  if (
    title.includes('ebc') &&
    /104\.7/.test(title) &&
    title.includes('addis')
  ) {
    return true;
  }

  return false;
}

export function normalizeStations(rawStations: RadioBrowserStation[]): RadioStation[] {
  const seen = new Set<string>();

  const mapped = rawStations
    .filter((station) => Boolean(station.url_resolved || station.url))
    .map((station) => {
      const title = cleanTitle(station.name);
      const streamUrl = resolveStreamUrl(station, title);
      const id = safeTrim(station.stationuuid) || `${title}-${streamUrl}`;
      const key = `${title.toLowerCase()}::${streamUrl.toLowerCase()}`;

      if (!streamUrl || seen.has(key)) {
        return null;
      }

      seen.add(key);

      const language = firstValue(station.language, 'Amharic');
      const city = firstValue(station.state, 'Addis Ababa');
      const tags = parseTags(station.tags);
      const subtitle = buildSubtitle(language, city, tags);

      return {
        city,
        country: firstValue(station.country, 'Ethiopia'),
        favicon: safeUrl(station.favicon),
        homepage: safeUrl(station.homepage),
        id,
        isFeatured: FEATURED_NAMES.some((name) =>
          title.toLowerCase().includes(name),
        ),
        language,
        streamUrl,
        subtitle,
        tags,
        title,
        votes: station.votes ?? 0,
      } satisfies RadioStation;
    })
    .filter((station): station is RadioStation => station !== null);

  const deduped = dedupeStationsByTitle(mapped);
  const filtered = deduped.filter((station) => !isBlockedStation(station));

  return filtered.sort(
    (left, right) => right.votes - left.votes || left.title.localeCompare(right.title),
  );
}

export function getFeaturedStations(stations: RadioStation[]): RadioStation[] {
  const featured = stations.filter((station) => station.isFeatured).slice(0, 6);

  if (featured.length > 0) {
    return featured;
  }

  return stations.slice(0, 6);
}

export function filterStations(
  stations: RadioStation[],
  query: string,
  favorites: string[],
  showFavoritesOnly: boolean,
): RadioStation[] {
  const normalizedQuery = query.trim().toLowerCase();

  return stations.filter((station) => {
    if (showFavoritesOnly && !favorites.includes(station.id)) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return (
      station.title.toLowerCase().includes(normalizedQuery) ||
      station.subtitle.toLowerCase().includes(normalizedQuery) ||
      station.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
    );
  });
}

function cleanTitle(value: string): string {
  return safeTrim(value).replace(/\s+/g, ' ');
}

function firstValue(value: string, fallback: string): string {
  const trimmed = safeTrim(value);

  if (!trimmed) {
    return fallback;
  }

  return trimmed
    .split(',')
    .map((entry) => entry.trim())
    .find(Boolean) ?? fallback;
}

function parseTags(value: string): string[] {
  return safeTrim(value)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function buildSubtitle(language: string, city: string, tags: string[]): string {
  if (tags.length === 0) {
    return `${language} • ${city}`;
  }

  return `${language} • ${city} • ${tags[0]}`;
}

function safeTrim(value: string | null | undefined): string {
  return typeof value === 'string' ? value.trim() : '';
}

function safeUrl(value: string | null | undefined): string | null {
  const trimmed = safeTrim(value);

  if (!trimmed.startsWith('http')) {
    return null;
  }

  return trimmed;
}
