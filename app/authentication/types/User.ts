export type UserType = {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  created_on: number;
  updated_on: number;
  is_active: boolean;
  is_verified: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  groups: Array<string>;
  spreadsheets: Array<string>;
  children: Array<string>;
  log: number;
};

export type AdminRoles = 'super_admin' | 'admin';
export type Roles = 'super_admin' | 'admin' | 'student';

export type UserDetails = {
  last_login: string;
  name: string;
  role: string;
  username: string;
  _id: string;
};
