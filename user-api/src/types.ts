export interface User {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  hair: { color: string };
  address: { postalCode: string; city: string };
  company: { department: string };
}

export interface DepartmentSummary {
  male: number;
  female: number;
  ageRange: string;
  hair: Record<string, number>;
  addressUser: Record<string, string>;
  addressCities: Record<string, string>;
}

export type GroupedResult = Record<string, DepartmentSummary>;
