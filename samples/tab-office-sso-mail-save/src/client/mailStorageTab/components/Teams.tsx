import * as React from 'react';
import { useState, useEffect } from "react";
import { Breadcrumb, BreadcrumbDivider, BreadcrumbLink, RedbangIcon, TeamsIcon } from '@fluentui/react-northstar';
import { IFolder } from "../../../model/IFolder";
import { Folder } from "./Folder";

export const Teams = (props) => {
  const [teams, setTeams] = useState<IFolder[]>();
  const [folders, setFolders] = useState<IFolder[]|null>(null);

  const getJoinedTeams = React.useCallback(async () => {
    props.getJoinedTeams().then((result) => {
      setTeams(result);
      setFolders(null);
    });
  },[props.getJoinedTeams]); // eslint-disable-line react-hooks/exhaustive-deps

  const getFolders = React.useCallback((driveId: string, folderId: string, name: string, parentFolder?: IFolder) => {    
    props.getFolders(driveId, folderId, name, parentFolder).then((result) => {
      setFolders(result);
    });
  },[props.getFolders]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getJoinedTeams();
  }, []);

  return (
    <div>
      {props.mail.alreadyStored &&
          <div className='saveHint'>
            <div><RedbangIcon /> You already saved this mail on <span>{new Date (props.mail.savedDate).toLocaleString()}</span></div>
            <div>to <a href={props.mail.savedUrl}>{props.mail.savedDisplayName}</a></div>
          </div>}
      <Breadcrumb>
        <Breadcrumb.Item>
          <BreadcrumbLink className='iconLogo' onClick={() => getJoinedTeams()} ><TeamsIcon /></BreadcrumbLink>
          {props.currentFolder !== null && props.currentFolder.parentFolder !== null &&
              <BreadcrumbDivider />}
          {props.currentFolder !== null && props.currentFolder.parentFolder !== null &&
              <BreadcrumbLink className='breadcrumbFolder' 
                              onClick={() => getFolders(props.currentFolder.parentFolder.driveID, 
                                                        props.currentFolder.parentFolder.id,
                                                        props.currentFolder.parentFolder.name,
                                                        props.currentFolder.parentFolder.parentFolder)} >{props.currentFolder.parentFolder.name}</BreadcrumbLink>}
          {props.currentFolder !== null && 
              <BreadcrumbDivider />}
          {props.currentFolder !== null && 
              <BreadcrumbLink>{props.currentFolder.name}</BreadcrumbLink>}
        </Breadcrumb.Item>
      </Breadcrumb>

      <ul>
        {folders === null && teams?.map(t => {
          return <Folder folder={t} getFolders={getFolders} />
        })}
        {folders !== null && folders?.map(f => {
          return <Folder folder={f} getFolders={getFolders} />
        })}
      </ul>
    </div>
  );
};