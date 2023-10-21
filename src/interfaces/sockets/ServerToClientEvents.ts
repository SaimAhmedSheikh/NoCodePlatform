import { IPageCode } from "../IPageCode";
import { ISession, ISessionUser } from "../ISessionUser";
import { IUser } from "../IUser";

export interface ServerToClientEvents {
    "pageCode:update": (pageCode: IPageCode, updatedBy: IUser) => void;
    "user:list": (users: ISessionUser[]) => void;
    "user:join": (user: ISessionUser, connected: boolean) => void;
    "user:leave": (userId: string) => void;
    "session:add": (session: ISession) => void
}
