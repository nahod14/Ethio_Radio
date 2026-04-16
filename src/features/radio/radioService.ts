import {
  getFeaturedStations,
  normalizeStations,
} from '@/features/radio/radioUtils';
import type { RadioBrowserStation, RadioStation } from '@/features/radio/types';

/** Stations not always returned by Radio Browser; stream URL from station’s official web embeds. */
function curatedEthiopianStations(): RadioBrowserStation[] {
  return [
    {
      changeuuid: 'curated-ebc-national',
      clickcount: 0,
      codec: 'MP3',
      country: 'Ethiopia',
      favicon: '',
      geo_lat: null,
      geo_long: null,
      homepage: 'https://ebc.et/',
      language: 'amharic,english',
      name: 'EBC National Radio',
      state: 'Addis Ababa',
      stationuuid: 'curated-ebc-national-radio',
      tags: 'news,talk,national',
      url: 'https://stream.zeno.fm/ad402tap7yzuv',
      url_resolved: 'https://stream.zeno.fm/ad402tap7yzuv',
      votes: 2500,
    },
  ];
}

const MIRRORS = [
  'https://de1.api.radio-browser.info',
  'https://fr1.api.radio-browser.info',
  'https://at1.api.radio-browser.info',
];

async function queryMirrors(path: string): Promise<RadioBrowserStation[]> {
  let lastError: Error | null = null;

  for (const mirror of MIRRORS) {
    try {
      const response = await fetch(`${mirror}${path}`, {
        headers: {
          'User-Agent': 'Ethio Radio Mobile App/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`Station request failed with ${response.status}`);
      }

      const data = (await response.json()) as RadioBrowserStation[];

      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error('Failed to load stations');
    }
  }

  if (lastError) {
    throw lastError;
  }

  return [];
}

export async function fetchEthiopianStations(): Promise<{
  featuredStations: RadioStation[];
  stations: RadioStation[];
}> {
  const [byName, byLanguage] = await Promise.allSettled([
    queryMirrors(
      '/json/stations/search?country=Ethiopia&hidebroken=true&order=votes&reverse=true&limit=80',
    ),
    queryMirrors(
      '/json/stations/search?language=amharic&hidebroken=true&order=votes&reverse=true&limit=40',
    ),
  ]);

  const combined: RadioBrowserStation[] = [
    ...curatedEthiopianStations(),
    ...(byName.status === 'fulfilled' ? byName.value : []),
    ...(byLanguage.status === 'fulfilled' ? byLanguage.value : []),
  ];

  if (combined.length === 0) {
    const errors: string[] = [];

    if (byName.status === 'rejected') {
      errors.push(
        byName.reason instanceof Error ? byName.reason.message : 'Query by name failed',
      );
    }
    if (byLanguage.status === 'rejected') {
      errors.push(
        byLanguage.reason instanceof Error
          ? byLanguage.reason.message
          : 'Query by language failed',
      );
    }

    throw new Error(
      errors.length > 0
        ? errors[0]
        : 'Failed to load Ethiopian radio stations from all sources',
    );
  }

  const normalized = normalizeStations(combined);

  return {
    featuredStations: getFeaturedStations(normalized),
    stations: normalized,
  };
}
