import * as d3 from 'd3';
import { d3Types } from '../MindMap.types';
import { contextMenu, contextMenuNode } from './contextMenus';
import { getViewBox } from './dimensions';

/*
 * Bind data to a <TAG> tag, inside a G element, inside the given root element.
 * Root is a D3 selection, data is an object or array, tag is a string.
 */
const bindData = (root: any, data: any, tag: any) => (
  root.append('g')
    .selectAll(tag)
    .data(data)
    .enter()
    .append(tag)
);

/*
 * Bind connections to PATH tags on the given SVG.
 */
export const d3Connections = (svg: any, connections: d3Types.d3Link[]) => (
  bindData(svg, connections, 'path')
    .attr('class', 'mindmap-connection')
);




export const d3Nodes = (svg: any, nodes: d3Types.d3Node[], editmode: boolean,addAction:()=>void) => {

  svg.on('contextmenu', function (e:any){contextMenu(e,addAction);} );

  const selection = svg.append('g')
    .selectAll('foreignObject')
    .data(nodes)
    .enter();

  const d3nodes = selection
    .append('foreignObject')
    .attr('class', 'mindmap-node')
    .attr('width', (node: d3Types.d3Node) => node.width + 4)
    .attr('height', (node: d3Types.d3Node) => node.height)
    .html((node: d3Types.d3Node) => node.html)
    .on('contextmenu', contextMenuNode )
    .on("dblclick",  (event: any, node: any) => { node.reactevents.onEdit(node); event.preventDefault(); })
    //.on("click", function (d: any) { alert("node was  clicked" + d); });

  const d3subnodes = selection.append('foreignObject')
    .attr('class', 'mindmap-subnodes')
    .attr('width', (node: d3Types.d3Node) => node.nodesWidth + 4)
    .attr('height', (node: d3Types.d3Node) => node.nodesHeight)
    .html((subnode: d3Types.d3Node) => subnode.nodesHTML)
    /*.on('contextmenu', function (d: any, i: any) {
      console.log('contextd3subnodes');
      console.log(d);
      console.log(i);
    });
*/
  return {
    nodes: d3nodes,
    subnodes: d3subnodes,
  };
};

/*
 * Callback for forceSimulation tick event.
 */
export const onTick = (conns: any, nodes: any, subnodes: any) => {
  const d = (conn: d3Types.d3Link) => [
    'M',
    conn.source.x,
    conn.source.y,
    'Q',
    conn.source.x + (conn.curve && conn.curve.x ? conn.curve.x : 0),
    conn.source.y + (conn.curve && conn.curve.y ? conn.curve.y : 0),
    ',',
    conn.target.x,
    conn.target.y,
  ].join(' ');

  // Set the connections path.
  conns.attr('d', d);

  // Set nodes position.
  nodes
    .attr('x', (node: d3Types.d3Node) => node.x - (node.width / 2))
    .attr('y', (node: d3Types.d3Node) => node.y - (node.height / 2));

  // Set subnodes groups color and position.
  subnodes
    .attr('x', (node: d3Types.d3Node) => node.x + (node.width / 2))
    .attr('y', (node: d3Types.d3Node) => node.y - (node.nodesHeight / 2));
};


/*
 * Return drag behavior to use on d3.selection.call().
 */
export const d3Drag = (simulation: any, svg: any, nodes: any) => {
  const dragStart = (event: any, node: any) => {
    console.log('dragStart');
    if (!event.active) {
      simulation.alphaTarget(0.2).restart();
    }

    node.fx = node.x;
    node.fy = node.y;
  };

  const dragged = (event: any, node: any) => {
    console.log('dragged');
    node.fx = event.x;
    node.fy = event.y;

  };

  const dragEnd = (event: any, node: any) => {
    console.log('dragEnd');
    if (!event.active) {
      simulation.alphaTarget(0);
    }

    svg.attr('viewBox', getViewBox(nodes.data()));

    node.reactevents.onMoved(node);
  };

  return d3.drag()
    .on('start', dragStart)
    .on('drag', dragged)
    .on('end', dragEnd)

};
/* eslint-enable no-param-reassign */


/*
 * Return pan and zoom behavior to use on d3.selection.call().
 */
export const d3PanZoom = (el: any) => (
  d3.zoom().scaleExtent([0.3, 5])
    .on('zoom', (element: any) => (
      el.selectAll('svg > g').attr('transform', element.transform)
    ))
);


