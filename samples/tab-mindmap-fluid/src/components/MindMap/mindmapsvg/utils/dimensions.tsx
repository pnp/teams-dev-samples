import { d3Types, IDimensions } from "../MindMap.types";

/*
 * Return the dimensions (width & height) that some HTML
 * with a given style would take in the page.
 */
export function getDimensions(html: string, style: { [key: string]: object }, classname: string): IDimensions {
    const el: HTMLSpanElement = document.createElement('span');


    // Set display: inline-block so that the size of el
    // will depend on the size of its children.
    el.style.display = 'inline-block';

    // Hide the element (it will be added to the page for a short time).
    el.style.visibility = 'hidden';

    el.className = classname;
    el.innerHTML = html;

    // Apply CSS rules.
    Object.keys(style).forEach((rule: string) => { (el.style as any)[rule] = style[rule]; });
    document.body.append(el);
    const dimensions: IDimensions = {
        width: el.offsetWidth,
        height: el.offsetHeight
    };

    el.remove();
    return dimensions;
};

/*
 * Return the dimensions of an SVG viewport calculated from
 * some given nodes.
 */
export function getViewBox(nodes: d3Types.d3Node[]): string {
    const Xs: number[] = [];
    const Ys: number[] = [];

    nodes.forEach((node:d3Types.d3Node) => {
        const x = node.x || node.fx;
        const y = node.y || node.fy;

        if (x) {
            Xs.push(x);
        }

        if (y) {
            Ys.push(y);
        }
    });

    if (Xs.length === 0 ){
        Xs.push(0);
    }
    if(Ys.length === 0) {
        Ys.push(0);
    }

    // Find the smallest coordinates...
    const min = [
        Math.min(...Xs) - 150,
        Math.min(...Ys) - 150,
    ];

    // ...and the biggest ones.
    const max = [
        (Math.max(...Xs) - min[0]) + 150,
        (Math.max(...Ys) - min[1]) + 150,
    ];

    return `${min.join(' ')} ${max.join(' ')}`;
};