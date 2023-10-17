import { IPageCode } from "../IPageCode";
import { IUser } from "../IUser";

export interface ServerToClientEvents {
    updatePageCode: (pageCode: IPageCode, updatedBy: IUser) => void;
}
  