import * as React from 'react';
import { TabsIcon } from '@fluentui/react-icons-northstar'

export const Folder = (props) => {
  const getFolder = () => {
    props.getFolders(props.folder.driveID, props.folder.id, props.folder.name);
  };

  return (
    <li className='liFolder'>
      <TabsIcon />                
      <span className='folder' onClick={getFolder}>{props.folder.name}</span>
    </li>
  );
}