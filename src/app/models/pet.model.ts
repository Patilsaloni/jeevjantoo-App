export interface Pet {
  id?: string;
  petName: string;
  breed: string;
  age: number;
  gender?: string; // "male", "female", "unknown"
  image?: string;
  category: string;
  favorite?: boolean;
  contact?: string;
  location?: string; // Used as city
  area?: string; // Added for area filter
  remarks?: string;
  timings?: string;
  healthStatus?: string;
  vaccinated?: boolean; // Added for vaccination filter
  description?: string;
  species?: string; // "dog", "cat", "other"
  petType?: string;
  status?: string;
  createdAt?: number;
  updatedAt?: number;
    ageRange?: string;
    dewormed: boolean;
  neutered: boolean;
  
}