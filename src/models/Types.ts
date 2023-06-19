import React from 'react'

type ID = string;

export type ComponentType<P extends keyof React.JSX.IntrinsicElements> = {
    componentId: ID;
    elementType: P;
    className?: string;
    data?: any;
} & React.ComponentProps<P> & React.PropsWithChildren

export type ComponentStateType = {
    projectId: ID;
    componentId: ID;
    states: {
        [key: string]: any
    }
}

export type ProjectType = {
    projectId: ID;
    name?: string;
    owner: ID;
    components: []

}