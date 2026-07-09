export interface Activity {
  id: number;
  name: string;
  address: string;
  distance: string; // original distance text
  distanceVal: number; // parsed numeric distance from 94th St
  transitDetail: string;
  what: string;
  reachableByTransit: boolean;
  category: string;
  hours: string;
  notes: string;
  url: string;
  lat: number | null;
  lng: number | null;
  calculatedDistance?: number; // dynamically calculated based on current home
}

export interface Restaurant {
  id: number;
  restaurant: string;
  address: string;
  distance: string; // original distance text
  distanceVal: number; // parsed numeric distance
  distanceCategory: string;
  websiteUrl: string;
  generalType: string;
  level: string;
  foodType: string;
  filterLevel: string;
  beenBefore: boolean;
  reservations: string;
  view: string;
  hours: string;
  notes: string;
  menu: string;
  sourceUrl: string;
  lat: number | null;
  lng: number | null;
  calculatedDistance?: number; // dynamically calculated based on current home
}

export interface HomeLocation {
  name: string;
  lat: number;
  lng: number;
}
