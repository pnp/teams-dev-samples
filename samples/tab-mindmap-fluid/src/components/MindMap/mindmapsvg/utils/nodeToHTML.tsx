import { d3Types } from "../MindMap.types";



/*
 * Return the HTML representation of a node.
 * The node is an object that has text, url, and category attributes;
 * all of them optional.
 */
export function nodeToHTML(node:d3Types.d3Node):string  {
  let href = `href="${node.url}"`;

  if (!node.url) {
    href = '';
  }

  return `<a id="node-${node.index}" ${href}>${node.text || ''} </a>`;
};