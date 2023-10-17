export enum UserRoles {
  Standard,
  Admin,
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role?: UserRoles;
}
