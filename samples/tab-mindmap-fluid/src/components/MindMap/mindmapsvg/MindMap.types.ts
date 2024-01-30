export interface IMindMapProps {
    data: IMindMapStoreItem;
    events: IMindMapEvents;
};
export interface IMindMapStoreItem {
    nodes: IMindMapNode[];
    connections: IMindMapConnection[];
}



export interface IDimensions {
    width: number;
    height: number;
}

export interface IMindMapNode {
    id: string;
    text?: string;
    fx?: number;
    fy?: number;
    note?: string;
    mindListColor?: string;
    mindListItems?: IMindList[];

}
export interface IMindList {
    text: string;
    url?: string;
    note?: string;
}

export interface IMindMapPosition {
    x: number;
    y: number;
}

export interface IMindMapConnection {
    id: string;
    source: string;
    target: string;
    curve?: IMindMapPosition;
}

export namespace d3Types {
    export type d3Node = {
        id: string;
        index: string,
        text: string,

        html: string,
        nodesHTML: string,

        category: string,
        url: string,
        x: number,
        y: number,
        fx: number | undefined,
        fy: number | undefined,
        note?: string,
        width: number,
        height: number,
        nodesWidth: number,
        nodesHeight: number,
        mindListColor: string,
        mindListItems: IMindList[],
        reactevents: any

    };

    export type d3Link = {
        source: { x: number, y: number },
        target: { x: number, y: number },
        curve: { x: number, y: number }
    };

}


export interface IMindMapEvents extends INodeEvents, IConnectionEvents{
   
}

export interface INodeEvents {
    onNodeChanged: (node: IMindMapNode) => void;
    onNodeAdded: (node: IMindMapNode,conn?: IMindMapConnection) => void;
    onNodeDeleted: (nodeId: string) => void;
    onNodePosChanged: (nodeId: string,x:number,y:number) => void;
}
export interface IConnectionEvents {
    onConnectionChanged: (conn: IMindMapConnection) => void;
    onConnectionAdded: (conn: IMindMapConnection) => void;
    onConnectionDeleted: (connId: string) => void;
}