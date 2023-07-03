
import MindMapWrapper from "../MindMap/mindmapsvg/MindMapWrapper";
import { useGetAudienceStore, useGetMindMapStore } from "./store";




export function MindMapContainer(props: { environment?: string }) {
    const {
        dispatch,
        actions: {
            nodeChanged, nodeAdded, nodeDeleted, nodePosChanged,
            connectionChanged, connectionAdded, connectionDeleted },
        queries: { getAllData },
    } = useGetMindMapStore();

    const {
        queries: { getAudienceSize, getAudiences },
    } = useGetAudienceStore();
    const audienceSize = getAudienceSize();
    const audiences = getAudiences();

    const minMapData = getAllData();
    return (
        <div>
            <div>Current Connected Users: {audienceSize}</div>
            <MindMapWrapper data={minMapData}
                onNodeAdded={(node, conn?) => {
                    dispatch(nodeAdded({ node: node, conn: conn }));
                }}
                onNodeChanged={(node) => { dispatch(nodeChanged({ node: node })); }}
                onNodeDeleted={(nodeId) => { dispatch(nodeDeleted({ nodeId: nodeId })); }}
                onNodePosChanged={(nodeId, x, y) => { dispatch(nodePosChanged({ nodeId: nodeId, x: x, y: y })); }}
                onConnectionAdded={(conn) => { dispatch(connectionAdded({ conn: conn })); }}
                onConnectionChanged={(conn) => { dispatch(connectionChanged({ conn: conn })); }}
                onConnectionDeleted={(connId) => { dispatch(connectionDeleted({ connId: connId })); }}
            />
            <div>Users: {audiences.map((x) => { return (<span style={{paddingRight:'10px'}}>{x.userName}</span>); })}</div>
        </div>
    );
}


