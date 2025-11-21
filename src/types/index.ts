export interface Breed {
  id: string;
  name: string;
  alt_names: string[];
  origin: string;
  size: 'toy' | 'small' | 'medium' | 'large' | 'giant';
  coat_length: 'short' | 'medium' | 'long';
  coat_type: string;
  colors: string[];
  ears: string;
  tail: string;
  temperament: string[];
  description: string;
}

export interface Sighting {
  id: string;
  breed_id: string | null;
  dog_name: string;
  photo_uris: string[];
  timestamp: number;
  latitude: number | null;
  longitude: number | null;
  notes: string;
}

export interface BreedFilter {
  size?: string[];
  coat_length?: string[];
  colors?: string[];
  ears?: string[];
  tail?: string[];
  temperament?: string[];
  search?: string;
}
