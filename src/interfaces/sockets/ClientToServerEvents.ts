import { IPageCode } from "../IPageCode";
import { IUser } from "../IUser";

export interface ClientToServerEvents {
    updatePageCode: (pageCode: IPageCode, updatedBy: IUser) => void;
  }
  
  