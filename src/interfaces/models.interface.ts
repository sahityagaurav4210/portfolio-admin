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