import { IUser } from "./IUser";

export interface ISessionUser {
    id: string;
    email: string;
    name: string;
    role: IUser['role'];
  }
  
  