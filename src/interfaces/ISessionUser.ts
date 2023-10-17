import { IUser } from "./IUser";

export interface ISessionUser {
    _id: string;
    email: string;
    name: string;
    role: IUser['role'];
  }
  
export interface ISession{
    sessionId: string;
    user: ISessionUser
}
