import * as React from 'react';

import { MindMap } from './MindMap';
import { IMindMapProps, IMindMapStoreItem, IMindMapEvents } from './MindMap.types';


export interface IMindMapWrapperProps extends IMindMapEvents {
    data: IMindMapStoreItem;
}



export interface IMindMapWrapperState {
    editable?: boolean;
}

export default class MindMapWrapper extends React.Component<IMindMapWrapperProps, IMindMapWrapperState> {
    
    constructor(props: IMindMapWrapperProps) {
        super(props);

        this.state = {

        };
    }


    public render(): React.ReactElement<IMindMapWrapperProps> {
        const { data } = this.props;
       

        const mindmapObject: IMindMapProps = {
            data: {
                nodes:data.nodes.slice(),
                connections:data.connections.slice(),
            },
            events: {
                onNodeChanged: this.props.onNodeChanged,
                onNodeAdded: this.props.onNodeAdded,
                onNodeDeleted: this.props.onNodeDeleted,
                onConnectionChanged: this.props.onConnectionChanged,
                onConnectionAdded: this.props.onConnectionAdded,
                onConnectionDeleted: this.props.onConnectionDeleted,
                onNodePosChanged: this.props.onNodePosChanged
            },
        };
        return (
            <div>
                <div className={'mainContent'} >
                    <MindMap {...mindmapObject} />
                </div>

            </div>
        );
    }

    
}
