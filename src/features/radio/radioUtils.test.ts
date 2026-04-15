import { describe, expect, it } from '@jest/globals';

import {
  filterStations,
  getFeaturedStations,
  normalizeStations,
} from '@/features/radio/radioUtils';
import type { RadioBrowserStation } from '@/features/radio/types';

describe('radioUtils', () => {
  it('normalizes and deduplicates station records', () => {
    const stations = normalizeStations([
      buildRawStation({
        name: 'Sheger FM 102.1',
        stationuuid: 'one',
        tags: 'news,talk,culture',
        url_resolved: 'https://stream.example/sheger',
        votes: 42,
      }),
      buildRawStation({
        name: ' Sheger   FM 102.1 ',
        stationuuid: 'two',
        url_resolved: 'https://stream.example/sheger',
        votes: 50,
      }),
    ]);

    expect(stations).toHaveLength(1);
    expect(stations[0]).toMatchObject({
      id: 'one',
      isFeatured: true,
      subtitle: 'Amharic • Addis Ababa • news',
      title: 'Sheger FM 102.1',
    });
  });

  it('returns featured stations when named matches exist', () => {
    const stations = normalizeStations([
      buildRawStation({ name: 'Fana FM', stationuuid: '1', votes: 1 }),
      buildRawStation({ name: 'Bisrat FM', stationuuid: '2', votes: 2 }),
      buildRawStation({ name: 'Community Voice', stationuuid: '3', votes: 10 }),
    ]);

    expect(getFeaturedStations(stations).map((station) => station.title)).toEqual([
      'Bisrat FM',
      'Fana FM',
    ]);
  });

  it('uses canonical Zeno URL for EBC National Radio (liveonlineradio embed)', () => {
    const stations = normalizeStations([
      buildRawStation({
        name: 'EBC National Radio',
        stationuuid: 'ebc-national',
        url: 'https://stream-99.zeno.fm/ad402tap7yzuv',
        url_resolved: 'https://stream-99.zeno.fm/ad402tap7yzuv',
        votes: 10,
      }),
    ]);

    expect(stations).toHaveLength(1);
    expect(stations[0]?.streamUrl).toBe('https://stream.zeno.fm/ad402tap7yzuv');
  });

  it('drops EBC Radio 104.7 Addis from the catalog', () => {
    const stations = normalizeStations([
      buildRawStation({
        name: 'EBC Radio 104.7 Addis Abeba',
        stationuuid: 'ebc-1047',
        url: 'https://stream-25.zeno.fm/2xguamap7yzuv',
        url_resolved: 'https://stream-25.zeno.fm/2xguamap7yzuv',
        votes: 10,
      }),
    ]);

    expect(stations).toHaveLength(0);
  });

  it('filters by query and favorites mode', () => {
    const stations = normalizeStations([
      buildRawStation({
        language: 'Amharic',
        name: 'Sheger FM',
        stationuuid: 'fav',
        tags: 'talk,news',
      }),
      buildRawStation({
        language: 'Oromo',
        name: 'Oromia Voice',
        stationuuid: 'other',
        tags: 'community',
      }),
    ]);

    expect(filterStations(stations, 'oromo', [], false)).toHaveLength(1);
    expect(filterStations(stations, '', ['fav'], true).map((station) => station.id)).toEqual([
      'fav',
    ]);
  });
});

function buildRawStation(overrides: Partial<RadioBrowserStation>): RadioBrowserStation {
  return {
    changeuuid: 'change',
    clickcount: 0,
    codec: 'MP3',
    country: 'Ethiopia',
    favicon: '',
    geo_lat: null,
    geo_long: null,
    homepage: '',
    language: 'Amharic',
    name: 'Station',
    state: 'Addis Ababa',
    stationuuid: 'station',
    tags: '',
    url: 'https://stream.example/live',
    url_resolved: 'https://stream.example/live',
    votes: 0,
    ...overrides,
  };
}
