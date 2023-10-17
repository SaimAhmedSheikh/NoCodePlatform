import { IUser } from "./IUser";

export interface IProject {
  _id?: string;
  name: string;
  createdBy: string;
  // members: IUser[];
}
