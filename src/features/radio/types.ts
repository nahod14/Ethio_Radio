export interface RadioBrowserStation {
  changeuuid: string;
  clickcount: number;
  codec: string;
  country: string;
  favicon: string;
  geo_lat: number | null;
  geo_long: number | null;
  homepage: string;
  language: string;
  name: string;
  state: string;
  stationuuid: string;
  tags: string;
  url: string;
  url_resolved: string;
  votes: number;
}

export interface RadioStation {
  city: string;
  country: string;
  favicon: string | null;
  homepage: string | null;
  id: string;
  isFeatured: boolean;
  language: string;
  streamUrl: string;
  subtitle: string;
  tags: string[];
  title: string;
  votes: number;
}

export type PlaybackPhase = 'idle' | 'loading' | 'playing' | 'paused' | 'error';
