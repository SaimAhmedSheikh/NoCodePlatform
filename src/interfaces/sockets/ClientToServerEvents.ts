import { IPageCode } from "../IPageCode";
import { IUser } from "../IUser";

export interface ClientToServerEvents {
    "pageCode:add": (pageCode: IPageCode) => void;
    "pageCode:update": (pageCode: IPageCode, updatedBy: IUser) => void;
    "user:join": (projectId: string) => void;
  }
  
  