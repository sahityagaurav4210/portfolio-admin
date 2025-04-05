export interface ILoginModel {
  phone?: string;
  password?: string;
}

export interface IViewDetails {
  _id: string;
  eventName: string;
  firedBy: string;
  createdAt: string;
}

export interface IHiringDetails {
  client_name: string;
  client_email: string;
  client_project_name: string;
  tenure?: number;
  hiring_type: string;
  budget: string;
  ipAddress: string;
}

export interface IContactDetails {
  first_name: string;
  last_name?: string;
  email: string;
  message: string;
  ipAddress: string;
}