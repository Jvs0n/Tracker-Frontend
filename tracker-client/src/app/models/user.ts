export interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  firstname?: string;
  lastname?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  sex?: string;
}

