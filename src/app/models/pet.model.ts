export interface Pet {
  id?: string;
  petName: string;
  breed: string;
  age: number;
  gender?: string;
  image?: string;
  category: string;
  favorite?: boolean;

  contact?: string; // phone number
  location?: string; // address
  remarks?: string;
  timings?: string;

  // Optional extra fields
  healthStatus?: string;
  description?: string;
  species?: string;
  petType?: string;
  status?: string;
  createdAt?: number;
  updatedAt?: number;
}
