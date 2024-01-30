import  { Component } from 'react';


import * as d3 from 'd3'

import {
    d3Connections,
    d3Nodes,
    d3Drag,
    d3PanZoom,
    onTick,
} from './utils/d3';




import './main.scss';
import { getDimensions, getViewBox } from './utils/dimensions';
import { nodeToHTML } from './utils/nodeToHTML';
import { mindlistToHTML } from './utils/mindlistToHTML';
import { d3Types, IMindMapConnection, IMindMapNode, IMindMapProps } from './MindMap.types';
import { ColorPicker, DefaultButton, Icon, IconButton, IPanelProps, Panel, PrimaryButton, TextField } from '@fluentui/react';
import { GenerateConnectionId, GenerateNodeId } from './GenerateIds';


export interface IMindMapState {
    showEditPanel?: boolean;
    editPanelTyp: EditPanelTyp
    currentNode?: d3Types.d3Node;
    tmpSubListItem?: string;
}

export enum EditPanelTyp {
    None,
    Node,
    AddConnection,
    RemoveConnection
}

export class MindMap extends Component<IMindMapProps, IMindMapState> {

    private nodes: d3Types.d3Node[] = [];
    private connections: d3Types.d3Link[] = [];
    private simulation: any;
    private mountPoint: any = undefined;
    constructor(props: IMindMapProps) {
        super(props);
        this.state = {
            editPanelTyp: EditPanelTyp.None
        };

        this.simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id((node) => { return (node as any).id }))
            .force('charge', d3.forceManyBody())
            .force('collide', d3.forceCollide().radius(100));
    }

    private prepareNode(node: d3Types.d3Node): void {
        node.html = nodeToHTML(node);
        node.nodesHTML = mindlistToHTML(node.mindListItems, node.mindListColor);
        node.reactevents = {
            onDelete: (node: d3Types.d3Node) => {
                const pos = this.props.data.nodes.findIndex((x) => x.text === node.text);
                this.props.data.nodes.slice(pos, 1);
                this.props.events.onNodeDeleted(node.id);
            },
            onEdit: (node: d3Types.d3Node) => {
                this.setState({
                    showEditPanel: true,
                    editPanelTyp: EditPanelTyp.Node,
                    currentNode: { ...node }
                })
            },
            onAdd: (parentnode: d3Types.d3Node) => {
                const newnode: IMindMapNode = {
                    id: GenerateNodeId(),
                    text: 'ChildNode',
                    fx: 40 + (parentnode.fx || 0),
                    fy: (parentnode.fy || 0)
                };

                //todo fx fy
                const newcon: IMindMapConnection = { id: GenerateConnectionId(), source: node.id, target: newnode.id, curve: { x: 0, y: 0 } }
                this.setState({
                    showEditPanel: true,
                    editPanelTyp: EditPanelTyp.Node,
                    currentNode: { ...newnode } as any
                }, () => {
                    this.props.events.onNodeAdded(newnode as any, newcon);

                })

            },
            onMoved: (node: d3Types.d3Node) => {
                this.props.events.onNodePosChanged(node.id, node.fx || 0, node.fy || 0)
            },
            onAddConnection: (node: d3Types.d3Node) => {
                this.setState({
                    showEditPanel: true,
                    editPanelTyp: EditPanelTyp.AddConnection,
                    currentNode: { ...node }
                });
            },
            onRemoveConnection: (node: d3Types.d3Node) => {
                this.setState({
                    showEditPanel: true,
                    editPanelTyp: EditPanelTyp.RemoveConnection,
                    currentNode: { ...node }
                });
            }

        }
        const dimensions = getDimensions(node.html, {}, 'mindmap-node');
        node.width = dimensions.width;
        node.height = dimensions.height;

        const nodesDimensions = getDimensions(node.nodesHTML, {}, 'mindmap-subnode-text');
        node.nodesWidth = nodesDimensions.width;
        node.nodesHeight = nodesDimensions.height;


        // this.nodes.forEach((node: d3Types.d3Node) => render(node));
    }

    /*
     * Add new class to nodes, attach drag behavior, and start simulation.
     */
    prepareEditor(svg: any, conns: any, nodes: any, subnodes: any) {
        nodes
            .attr('class', 'mindmap-node mindmap-node--editable')
            .on('dblclick', (node: d3Types.d3Node) => {
                node.fx = undefined;
                node.fy = undefined;
            });

        nodes.call(d3Drag(this.simulation, svg, nodes));

        // Tick the simulation 100 times.
        for (let i = 0; i < 100; i += 1) {
            this.simulation.tick();
        }
        onTick(conns, nodes, subnodes);

        setTimeout(() => {
            this.simulation
                .alphaTarget(0.5).on('tick', () => onTick(conns, nodes, subnodes));
        }, 200);
    }
    /* eslint-enable no-param-reassign */

    /*
     * Render mind map using D3.
     */
    renderMap() {
        this.nodes = [];
        this.connections = [];
        this.props.data.nodes.forEach((x) => { this.nodes.push({ ...x } as any) });
        this.props.data.connections.forEach((x) => { this.connections.push({ ...x } as any) });
        const svg = d3.select(this.mountPoint);

        // Clear the SVG in case there's stuff already there.
        svg.selectAll('*').remove();

        // Add subnode group
        svg.append('g').attr('id', 'mindmap-subnodes');
        this.nodes.forEach((x) => this.prepareNode(x));
        
        // Bind data to SVG elements and set all the properties to render them.
        const connections = d3Connections(svg, this.connections as any);
        const { nodes, subnodes } = d3Nodes(svg, this.nodes, true,
            ()=>{ const  newnode= {
                id: GenerateNodeId(),
                text: 'ChildNode',
                fx: 40  ,
                fy: 40
            };
                this.setState({
                    showEditPanel: true,
                    editPanelTyp: EditPanelTyp.Node,
                    currentNode: { ...newnode } as any
                }, () => {
                    this.props.events.onNodeAdded(newnode as any);

                });
            }
            );
        nodes.append('title').text((node: d3Types.d3Node) => node.note);

        // Bind nodes and connections to the simulation.
        this.simulation
            .nodes(this.nodes)
            .force('link').links(this.connections);

        this.prepareEditor(svg, connections, nodes, subnodes);
        

        // Tick the simulation 100 times.
        for (let i = 0; i < 100; i += 1) {
            this.simulation.tick();
        }
        onTick(connections, nodes, subnodes);

        // Add pan and zoom behavior and remove double click to zoom.
        svg.attr('viewBox', getViewBox(nodes.data()))
            .call(d3PanZoom(svg))
            .on('dblclick.zoom', null);
    }

    componentDidMount() {
        this.renderMap();
    }

    componentDidUpdate() {
        d3.zoom().transform(d3.select(this.mountPoint), d3.zoomIdentity);
        this.renderMap();
    }

    // eslint-disable-next-line class-methods-use-this
    render() {
        return (
            <div>
                <Panel
                    isOpen={this.state.showEditPanel}
                    onDismiss={this.dismissEditPanel.bind(this)}
                    headerText={this.state.currentNode?.text}
                    isBlocking={this.state.editPanelTyp === EditPanelTyp.Node}
                    closeButtonAriaLabel="Close"
                    onRenderFooterContent={this.renderEditPanelFooter.bind(this)}
                    // Stretch panel content to fill the available height so the footer is positioned
                    // at the bottom of the page
                    isFooterAtBottom={true}
                >
                    <div>
                        {!!this.state.currentNode && this.state.editPanelTyp === EditPanelTyp.Node && (<div>
                            <TextField
                                label={'locTextLabel'}
                                value={this.state.currentNode.text}
                                placeholder={'locPlaceholderNodeText'}
                                onChange={(e, v) => {
                                    let currentstate = this.state.currentNode as d3Types.d3Node
                                    currentstate.text = v ? v : '';
                                    this.setState({ currentNode: currentstate })
                                }} />
                            <TextField value={this.state.currentNode.note}
                                label={'locNoteLabel'}
                                placeholder={'locPlaceholderNodeNode'}
                                multiline={true}
                                onChange={(e, v) => {
                                    let currentstate = this.state.currentNode as d3Types.d3Node
                                    currentstate.note = v ? v : '';
                                    this.setState({ currentNode: currentstate })
                                }} />
                            <ColorPicker
                                color={this.state.currentNode.mindListColor}
                                onChange={(e, c) => {
                                    let currentstate = this.state.currentNode as d3Types.d3Node
                                    currentstate.mindListColor = `#${c.hex}`;
                                    this.setState({ currentNode: currentstate })
                                }}
                                alphaType={'none'}
                                showPreview={true}

                            />
                            <div>

                                <div>
                                    <h4>Idea List</h4>
                                    <ul>
                                        {this.state.currentNode?.mindListItems?.map((mli, i) => {
                                            return (<li key={i}>
                                                <TextField value={mli.text}
                                                    placeholder={'locPlaceholderSubNodeText'}
                                                    onChange={(e, v) => {
                                                        let currentstate = this.state.currentNode as d3Types.d3Node
                                                        currentstate.mindListItems[i].text = v || '';
                                                        this.setState({ currentNode: currentstate })
                                                    }} />
                                            </li>)
                                        })}
                                    </ul>
                                    <TextField value={this.state.tmpSubListItem || ''}
                                        placeholder={'locPlaceholderSubNodeText'}
                                        onChange={(e, v) => {

                                            this.setState({ tmpSubListItem: v })
                                        }} />
                                    <IconButton iconProps={{ iconName: 'Add' }}
                                        title="Add"
                                        ariaLabel="Add"
                                        disabled={!this.state.tmpSubListItem || this.state.tmpSubListItem.length === 0}
                                        onClick={() => {
                                            let currentstate = this.state.currentNode as d3Types.d3Node;
                                            if (!currentstate.mindListItems) {
                                                currentstate.mindListItems = [];
                                            }
                                            currentstate.mindListItems.push({ text: this.state.tmpSubListItem || '' });
                                            this.setState({ currentNode: currentstate, tmpSubListItem: undefined })
                                        }}
                                    />
                                </div>
                            </div>
                        </div>)
                        }
                        {this.state.editPanelTyp === EditPanelTyp.AddConnection && this.renderAddConnection()}
                        {this.state.editPanelTyp === EditPanelTyp.RemoveConnection && this.renderRemoveConnection()}
                    </div>
                </Panel>
                <svg className="mindmap-svg" ref={(input) => { this.mountPoint = input; }} />
            </div>
        );
    }

    private renderEditPanelFooter(panelProps: IPanelProps | undefined, defaultRender?: (panelProps?: IPanelProps) => JSX.Element | null): JSX.Element | null {
        if (this.state.editPanelTyp === EditPanelTyp.Node)
            return (
                <div>
                    <PrimaryButton onClick={this.saveNodeData.bind(this)} >
                        Save
                    </PrimaryButton>
                    <DefaultButton onClick={this.dismissEditPanel.bind(this)}>Cancel</DefaultButton>
                </div>
            );
        return (<div></div>);
    }

    private dismissEditPanel() {
        this.setState({ showEditPanel: false, editPanelTyp: EditPanelTyp.None, currentNode: undefined, tmpSubListItem: undefined });
    }
    private saveNodeData() {
        //saveEvent
        this.props.events.onNodeChanged(this.state.currentNode as IMindMapNode)
        this.setState({ showEditPanel: false, editPanelTyp: EditPanelTyp.None, currentNode: undefined, tmpSubListItem: undefined });
    }


    private renderRemoveConnection(): JSX.Element {

        if (!!this.state.currentNode) {
            const nodeId = this.state.currentNode.id;
            const selectedconnections: any[] = this.props.data.connections.filter((x) => x.source === nodeId || x.target === nodeId)
            const nodekeys: any = this.props.data.nodes.reduce((acc, curr) =>
                ({ ...acc, [curr.id]: curr.text })
                , {});

            return (<div>
                {selectedconnections.length > 0 && (<div className='action-List'>
                    {selectedconnections.map((con) => {
                        return (<div key={'removecon' + con.id} className='action-List-Item' onClick={() => {
                            if (selectedconnections.length === 1) {
                                this.setState({
                                    showEditPanel: false,
                                    editPanelTyp: EditPanelTyp.None,
                                    currentNode: undefined,
                                    tmpSubListItem: undefined
                                }, () => { this.props.events.onConnectionDeleted(con.id) });

                            } else {
                                this.props.events.onConnectionDeleted(con.id);
                            }

                        }} >
                            <span className='text'>{nodekeys[con.source]}</span>
                            <span className='arrow'>--&gt;</span>
                            <span className='text'>{nodekeys[con.target]}</span>  <Icon
                                iconName='Delete'
                                title="Delete"
                            />
                        </div>)

                    })}
                </div>)}

            </div>)
        }
        return (<div>

        </div>)
    }
    private renderAddConnection(): JSX.Element {
        if (!!this.state.currentNode) {
            const nodeId = this.state.currentNode.id;
            const selectedconnections = this.props.data.connections.filter((x: any) => x.source === nodeId || x.target === nodeId)
            const nodekeys: any = this.props.data.nodes.reduce((acc, curr) =>
                ({ ...acc, [curr.id]: curr.text })
                , {});
            const possibleTargets = this.props.data.nodes.filter(i =>
                selectedconnections.findIndex((s) => s.source === i.id || s.target === i.id) === -1
                // && nodeId !== i.id
            );


            return (<div>
                <p>
                    {possibleTargets.length > 0 ? (<div className='action-List'>
                        {possibleTargets.map((t) => {
                            return (<div className='action-List-Item' onClick={() => {
                                const conn: IMindMapConnection = {
                                    id: GenerateConnectionId(),
                                    source: nodeId,
                                    target: t.id,
                                    curve: { x: 0, y: 0 }
                                }
                                if (possibleTargets.length === 1) {
                                    this.setState({
                                        showEditPanel: false,
                                        editPanelTyp: EditPanelTyp.None,
                                        currentNode: undefined,
                                        tmpSubListItem: undefined
                                    }, () => { this.props.events.onConnectionAdded(conn) });

                                } else {
                                    this.props.events.onConnectionAdded(conn);
                                }

                            }} >
                                <span>{t.text}</span>  <Icon iconName='Add'
                                    title="Add"
                                    ariaLabel="Add"
                                />
                            </div>)
                        })}

                    </div>) : (<h3>No Connection found to Add</h3>)}
                </p>
                {selectedconnections.length > 0 &&
                    (<p>
                        <h2>Current Connections</h2>
                        <ul className='info-List'>
                            {selectedconnections.map((con) => {
                                return (<li key={'removecon' + con.id}>
                                    <div className='info-List-item'>
                                        <span className='text'>{nodekeys[con.source]}</span><span className='arrow'>--&gt;</span><span className='text'>{nodekeys[con.target]}</span>
                                    </div>
                                </li>)

                            })}
                        </ul>
                    </p>)
                }

            </div>
            )
        }
        return (<div>

        </div>)
    }
}



export const DefaultNode: IMindMapNode = {
    id: GenerateNodeId(),
    text: 'Default',
    fx: 100,
    fy: 100
}