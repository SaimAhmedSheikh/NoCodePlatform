import React from "react";
import { IUser } from "./IUser";

export interface IComponent extends React.PropsWithChildren<{}> {
    _id: string;
    elementType: keyof React.JSX.IntrinsicElements;
    className?: string;
    data?: any;
    props?: {
      [key: string]: any;
    };
    updatedBy?: IUser;
  };