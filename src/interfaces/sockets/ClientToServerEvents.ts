import { IPageCode } from "../IPageCode";
import { IUser } from "../IUser";

export interface ClientToServerEvents {
    "pageCode:update": (pageCode: IPageCode, updatedBy: IUser) => void;
  }
  
  