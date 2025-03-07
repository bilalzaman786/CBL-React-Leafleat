export interface Store {
  id: string;
  coords: [number, number];
  type: 'census' | 'new';
  region: string;
  city: string;
}