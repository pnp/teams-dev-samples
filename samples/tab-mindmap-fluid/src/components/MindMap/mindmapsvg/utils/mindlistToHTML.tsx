import {  IMindList } from '../MindMap.types';


export function mindlistToHTML(mindListItems:IMindList[]| undefined, fcolor?:string):string  {
    if(!mindListItems){
        return '';
    }
  let color = fcolor || '';

 

  return mindListItems.map((subnode) => {
   /* let href = `href="${subnode.url}"`;
   
    if (!subnode.url) {
      href = '';
    }
*/
    return `<div class="mindmap-subnode-group" style="border-color:${color}">
      ${subnode.text || ''}

      </div>`;
  }).join('');
};

