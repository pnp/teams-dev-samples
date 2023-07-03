import { EventEmitter } from "events";
import { IFluidContainer, ISharedMap, SharedMap } from "fluid-framework";
import { AzureContainerServices, IAzureAudience, AzureMember } from "@fluidframework/azure-client";
import { IValueChanged } from "@fluidframework/map";

import { ISharedString } from "@fluidframework/sequence";
import { IMindList, IMindMapConnection, IMindMapNode } from "../../MindMap/mindmapsvg/MindMap.types";

const c_NodeIdPrefix = "nId_";
const c_TextPrefix = "nText_";
const c_NotePrefix = "nNote_";
const c_ColorPrefix = "nColor_";
const c_ItemsPrefix = "nItems_"
const c_PosPrefix = "nPos_"
const c_Conn = "nConn_"
const c_ConnID = "nConnID_"

export type EventPayload = {
	type: string;
	changed: IValueChanged;
	data?: any;
};

// init before attach Container!!!
export function InitMindMapContainer(container: IFluidContainer)
{
    (container.initialObjects.nodes as SharedMap).set(c_NodeIdPrefix+"1", "1");
  (container.initialObjects.nodes as SharedMap).set(c_TextPrefix+"1", "Welcome");
  (container.initialObjects.nodes as SharedMap).set(c_PosPrefix+"1", { x: 50, y: 20 });
  
}

export class MindMapFluidModel extends EventEmitter  {
    private nodes: ISharedMap;
    private connections: ISharedMap;
    private title: ISharedString;
    private audience: IAzureAudience;

    private container: IFluidContainer;
    private services: AzureContainerServices;

    constructor(
        
         container: IFluidContainer,
         services: AzureContainerServices,
    ) {
        super();
        this.container = container;
        this.services = services;
        this.nodes = container.initialObjects.nodes as ISharedMap;
        this.connections = container.initialObjects.connections as ISharedMap;
        this.title = container.initialObjects.title as ISharedString;
        this.audience = services.audience;
/*
        this.audience.on("memberAdded", (members) => {
              console.log("valueChanged audience");
            const membersChangedPayload = { type: "membersChanged" };
            this.emit("modelChanged", membersChangedPayload);
        });
        this.audience.on("memberRemoved", (members) => {
            console.log("valueChanged audience");
            const membersChangedPayload = { type: "membersChanged" };
            this.emit("modelChanged", membersChangedPayload);
        });
*/
        this.nodes.on("valueChanged", (changed:IValueChanged, local, target) => {
           console.log("valueChanged nodes");
            const changedNodePayload: EventPayload = { type: "singleNodeChange", changed };
            this.emit("modelChanged", changedNodePayload);
        });

        this.connections.on("valueChanged", (changed:IValueChanged, local, target) => {
            console.log("valueChanged connections");
            const changedNodePayload: EventPayload = { type: "singleConnectionChange", changed };
            this.emit("modelChanged", changedNodePayload);
        });
    }

    public getAudience = (): AzureMember[] => {
        const members = Array.from(this.audience.getMembers().values());
        return members;
    };
    public AddOrUpdateNode(mnode: IMindMapNode) {
        
        this.UpdateNodeText(mnode.id, mnode.text || '');
        this.UpdateNodeNote(mnode.id, mnode.note || '');
        this.UpdateNodeListColor(mnode.id, mnode.mindListColor || '');
        this.UpdateNodeList(mnode.id, mnode.mindListItems || []);
        this.UpdateNodePos(mnode.id, { x: mnode.fx || 0, y: mnode.fy || 0 });
        this.nodes.set(c_NodeIdPrefix + mnode.id, mnode.id); //this is needed for Change Detection

    }
    public DeleteNode(nodeId: string) {

        this.nodes.delete(c_TextPrefix + nodeId);
        this.nodes.delete(c_NotePrefix + nodeId);
        this.nodes.delete(c_ColorPrefix + nodeId);
        this.nodes.delete(c_ItemsPrefix + nodeId);
        this.nodes.delete(c_PosPrefix + nodeId);
        this.nodes.set(c_NodeIdPrefix + nodeId, 0); // Needed To detect App or Deleted
    }
    AddOrUpdateConnection(conn: IMindMapConnection) {
        this.connections.set(c_Conn + conn.id, conn);
        this.connections.set(c_ConnID + conn.id, conn.id); // Needed To detect App or Deleted
    }
    DeleteConnection(connectionId: string) {
        this.connections.delete(c_Conn + connectionId);
        this.connections.set(c_ConnID + connectionId, 0); // Needed To detect App or Deleted
    }

    public UpdateNodeText(nodeId: string, value: string) {
        this.nodes.set(c_TextPrefix + nodeId, value);
    }
    public UpdateNodeNote(nodeId: string, value: string) {
        this.nodes.set(c_NotePrefix + nodeId, value);
    }
    public UpdateNodeListColor(nodeId: string, value: string) {
        this.nodes.set(c_ColorPrefix + nodeId, value);
    }
    public UpdateNodeList(nodeId: string, value: Object[]) {
        this.nodes.set(c_ItemsPrefix + nodeId, value);
    }
    public UpdateNodePos(nodeId: string, pos: { x: number, y: number }) {
        this.nodes.set(c_PosPrefix + nodeId, pos);
    }

    public get allNodes() {
        const allNodeIds = Array.from(this.nodes.keys()).filter((x) => x.startsWith(c_NodeIdPrefix));
        const nodes: IMindMapNode[] = [];
        allNodeIds.forEach((n) => {
            const nid = n.substring(c_NodeIdPrefix.length)
            const node = this.GetNodeById(nid);
            if (!!node) {
                nodes.push(node)
            }
        });
        return nodes;
        // return this.root.get(ValueKey);
    }
    public get allConnections() {
        const allConnectionIds = Array.from(this.connections.keys()).filter((x) => x.startsWith(c_ConnID));
        const connections: IMindMapConnection[] = [];
        allConnectionIds.forEach((n) => {
            const nid = n.substring(c_ConnID.length)
            const con = this.GetConnectionById(nid);
            if (!!con) {
                connections.push(con)
            }
        });
        return connections;
    }

    public GetNodeById(nodeId: string): IMindMapNode | undefined {
        if (this.nodes.get(c_NodeIdPrefix + nodeId) !== nodeId) {
            return undefined;
        }
        const pos = this.nodes.get(c_PosPrefix + nodeId);
        const mnode: IMindMapNode = {
            id: nodeId,
            text: this.nodes.get(c_TextPrefix + nodeId),
            note: this.nodes.get(c_NotePrefix + nodeId),
            mindListColor: this.nodes.get(c_ColorPrefix + nodeId),
            mindListItems: this.nodes.get(c_ItemsPrefix + nodeId) as IMindList[],
            fx: pos.x,
            fy: pos.y,

        };
        return mnode;
    }

    public GetNodePosById(nodeId: string): { x: number, y: number } {
        const pos = this.nodes.get(c_PosPrefix + nodeId);
        return pos;
    }

    public GetConnectionById(connId: string): IMindMapConnection | undefined {
        if (this.connections.get(c_ConnID + connId) !== connId) {
            return undefined;
        }
        const data = this.connections.get(c_Conn + connId);
        const mconn: IMindMapConnection = { ...data, ...{ id: connId } }
        return mconn;
    }

}