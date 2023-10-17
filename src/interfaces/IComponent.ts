import React from "react";

export interface IComponent extends React.PropsWithChildren<{}> {
    _id: string;
    elementType: keyof React.JSX.IntrinsicElements;
    className?: string;
    data?: any;
    props?: {
      [key: string]: any;
    };
  };