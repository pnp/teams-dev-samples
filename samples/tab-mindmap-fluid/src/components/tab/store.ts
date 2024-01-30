import { IMindMapConnection, IMindMapNode, IMindMapStoreItem } from "../MindMap/mindmapsvg/MindMap.types";
import { useGetStore } from "./hooks/useGetStore";
import { MindMapFluidModel } from "./model/MindMapFluidModel";
import { AzureMember } from "@fluidframework/azure-client";


type IMindMapQueries = {
	getAllData: () => IMindMapStoreItem;

};

type IMindMapActions = {
	nodeChanged: (payload: { node: IMindMapNode }) => void;
	nodeAdded: (payload: { node: IMindMapNode, conn?: IMindMapConnection }) => void;
	nodeDeleted: (payload: { nodeId: string }) => void;
	nodePosChanged: (payload: { nodeId: string, x: number, y: number }) => void;

	connectionChanged: (payload: { conn: IMindMapConnection }) => void;
	connectionAdded: (payload: { conn: IMindMapConnection }) => void;
	connectionDeleted: (payload: { connId: string }) => void;
};


const getLoadState = (model: MindMapFluidModel) => {
	const storeitem: IMindMapStoreItem = {
		nodes: !model.allNodes || model.allNodes.length === 0 ? [{ id: "1", text: "Welcome" }] : model.allNodes,
		connections: model.allConnections
	}
	return storeitem;
}

export const useGetMindMapStore = () =>
	useGetStore<IMindMapStoreItem, IMindMapActions, IMindMapQueries>({
		// Establish initial state on load
		initialState: (model) => getLoadState(model),

		// Specify stateful queries to use in the view
		queries: {
			getAllData: (state) => {
				return state;
			},
		},

		// Specify actions, their payloads, and how they will interact with the model
		actions: {

			nodeAdded: (model, payload: { node: IMindMapNode, conn?: IMindMapConnection }) => {
				model.AddOrUpdateNode(payload.node);
				if (!!payload.conn) {
					console.log(payload.conn);
					model.AddOrUpdateConnection(payload.conn);
				}
			},
			nodeChanged: (model, payload: { node: IMindMapNode }) => {
				model.AddOrUpdateNode(payload.node);
			},
			nodeDeleted: (model, payload: { nodeId: string }) => {
				const { nodeId } = payload;
				const linkedConnections = model.allConnections.filter((c: any) => c.source === nodeId || c.target === nodeId);
				linkedConnections.forEach(conn => {
					model.DeleteConnection(conn.id);
				});
				model.DeleteNode(nodeId);
			},
			nodePosChanged: (model, payload: { nodeId: string, x: number, y: number }) => {
				const { nodeId, x, y } = payload;
				model.UpdateNodePos(nodeId, { x: x, y: y });
			},

			connectionChanged: (model, payload: { conn: IMindMapConnection }) => {
				const { conn } = payload;
				model.AddOrUpdateConnection(conn);
			},
			connectionAdded: (model, payload: { conn: IMindMapConnection }) => {
				const { conn } = payload;
				model.AddOrUpdateConnection(conn);
			},
			connectionDeleted: (model, payload: { connId: string }) => {
				model.DeleteConnection(payload.connId);
			}
		},

		// Sync view state with Fluid state by loading default state or patching the key that changed
		reducer: (model, draft, { type, changed }) => {
			console.log('reducer called');
			console.log(type);
			switch (type) {
				case "singleNodeChange":
					console.log('change emitted');
					const nodeid = changed.key.split("_")[1];
					const testResult = draft.nodes.findIndex(p => p.id === nodeid);
					const newdata = model.GetNodeById(nodeid);
					if (newdata) {
						if (testResult > -1) {
							draft.nodes[testResult] = newdata;
						}else {
							draft.nodes.push(newdata);
						}
					}else {
						if (testResult > -1) {
							draft.nodes.splice(testResult,1);
						}
					}
					break;
				case "singleConnectionChange":
					console.log('change emitted');
					const connid = changed.key.split("_")[1];
					const testConnection = draft.connections.findIndex(p => p.id === connid);
					const newConnection = model.GetConnectionById(connid);
					if (newConnection) {
						if (testConnection > -1) {
							draft.connections[testConnection] = newConnection;
						}else {
							draft.connections.push(newConnection);
						}
					}else {
						if (testConnection > -1) {
							draft.connections.splice(testConnection,1);
						}
					}
					break;
				case "singleDelete":
					//	delete draft[changed.key];
					break;
				default:
					return getLoadState(model);
			}
		},
	});

type IAudienceQueries = {
	getAudienceSize: () => number;
	getAudiences: () => AzureMember<any>[];
};

export const useGetAudienceStore = () =>
	useGetStore<AzureMember[], {}, IAudienceQueries>({
		initialState: (model) => model.getAudience(),
		queries: {
			getAudienceSize: (state) => state.length,
			getAudiences: (state) => state
		},
		actions: {},
		reducer: (model) => {
			console.log("reducer useGetAudienceStore");
			return model.getAudience();
		},
	});