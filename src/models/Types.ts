import React from "react";

type ID = string;

export type ComponentType = {
  componentId: ID;
  elementType: keyof React.JSX.IntrinsicElements;
  className?: string;
  data?: any;
  props?: {
    [key: string]: any;
  };
} & React.PropsWithChildren;

export type ComponentStateType = {
  projectId: ID;
  componentId: ID;
  states: {
    [key: string]: any;
  };
};

export type ProjectType = {
  projectId: ID;
  name?: string;
  owner: ID;
  components: [];
};
