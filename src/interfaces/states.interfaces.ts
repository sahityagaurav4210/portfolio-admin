export interface IProfilePayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  websites: string;
  avatar?: string;
  _id?: string;
}

export interface IAuthUserPayload {
  name: string;
  email?: string;
  phone: string;
}

export interface IAuthUserProfilePayload {
  name: string;
  email?: string;
  phone: string;
  websites?: string[];
  address?: string;
}
