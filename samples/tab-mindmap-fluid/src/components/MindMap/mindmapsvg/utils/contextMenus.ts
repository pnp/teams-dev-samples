import * as d3 from "d3";


export const contextMenuNodeActions: { text: string, iconName: string , action: string}[] = [
    { text: 'Add Child', iconName: 'Add', action:'onAdd' },
    { text: 'Edit Node', iconName: 'EditNote', action:'onEdit' },
    { text: 'Delete Node', iconName: 'Delete', action:'onDelete' },
    { text: 'Add Connection', iconName: 'Link', action:'onAddConnection' },
    { text: 'Remove Connection', iconName: 'RemoveLink', action:'onRemoveConnection' },
]

export const contextMenuActions: { text: string, iconName: string , action: string}[] = [
    { text: 'Add', iconName: 'Add', action:'onAddNew' },
 
]

export function contextMenu(event: any,action:()=>void): void {
   
    contextMenuActions.forEach((d: any) => {
        d.html = `<div>
        <i class="ms-Icon ms-Icon--${d.iconName}" aria-hidden="true"></i>
        <span>${d.text}</span>
        </div>`
    });
    d3.selectAll('.context-menu-blank').data([1])
        .enter()
        .append('div')
        .attr('class', '.context-menu-blank');
    // close menu
    d3.select('body').on('click.context-menu-blank', function () {
        d3.select('.context-menu-blank').style('display', 'none');
    });
    // this gets executed when a contextmenu event occurs
    d3.selectAll('.context-menu-blank')
        .html('')
        .append('ul')
        .selectAll('li')
        .data(contextMenuActions).enter()
        .append('li')
        .html((d:any)=>d.html)
      //  .text((d: any) => d.text)
        
        .on('click', function (e,n) { console.log(e);
            //node.reactevents[n.action](node);
            
            d3.select('.context-menu-blank').style('display', 'none');
            return e; })


    //.text(function (d) { return d; });
    d3.select('.context-menu-blank').style('display', 'none');
    // show the context menu
    d3.select('.context-menu-blank')
        .style('left', (event.pageX - 2) + 'px')
        .style('top', (event.pageY - 2) + 'px')
        .style('display', 'block');
    event.preventDefault();
};


export function contextMenuNode(event: any, node: any): void {
    contextMenuNodeActions.forEach((d: any) => {
        d.html = `<div>
        <i class="ms-Icon ms-Icon--${d.iconName}" aria-hidden="true"></i>
        <span>${d.text}</span>
        </div>`
    });
    d3.selectAll('.context-menu').data([1])
        .enter()
        .append('div')
        .attr('class', 'context-menu');
    // close menu
    d3.select('body').on('click.context-menu', function () {
        d3.select('.context-menu').style('display', 'none');
    });
    // this gets executed when a contextmenu event occurs
    d3.selectAll('.context-menu')
        .html('')
        .append('ul')
        .selectAll('li')
        .data(contextMenuNodeActions).enter()
        .append('li')
        .html((d:any)=>d.html)
      //  .text((d: any) => d.text)
        
        .on('click', function (e,n) { console.log(e);
            node.reactevents[n.action](node);
            d3.select('.context-menu').style('display', 'none');
            return e; })


    //.text(function (d) { return d; });
    d3.select('.context-menu').style('display', 'none');
    // show the context menu
    d3.select('.context-menu')
        .style('left', (event.pageX - 2) + 'px')
        .style('top', (event.pageY - 2) + 'px')
        .style('display', 'block');
    event.preventDefault();
};