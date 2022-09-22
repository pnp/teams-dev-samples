import * as React from "react";
import { Provider, Flex, Button, List, ListItemProps, PaperclipIcon, Dialog, SaveIcon} from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import { app, authentication } from "@microsoft/teams-js";
import Axios from "axios";
import { IFolder } from "../../model/IFolder";
import { IMail } from "../../model/IMail";
import { OneDrive } from "./components/OneDrive";
import { Teams } from "./components/Teams";

/**
 * Implementation of the Mail Storage Tab content page
 */
export const MailStorageTab = () => {
  const [{ inTeams, theme, context }] = useTeams();
  const [entityId, setEntityId] = useState<string | undefined>();
  const [token, setToken] = useState<string>();
  const [error, setError] = useState<string>();
  const [mails, setMails] = React.useState<IMail[]>([]);
  const [mailItems, setMailItems] = React.useState<ListItemProps[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState<number>();
  const [currentFolder, setCurrentFolder] = React.useState<IFolder|null>(null);
  const [dialogContent, setDialogContent] = React.useState<JSX.Element|null>(null);

  const attachmentIcon = <PaperclipIcon />;
  const savedIcon = <SaveIcon />;

  const getMails = async (token: string) => {
    const response = await Axios.get(`https://${process.env.PUBLIC_HOSTNAME}/api/mails`,
    { headers: { Authorization: `Bearer ${token}` }});

    setMails(response.data);
  };

  const saveMail = async () => {
    alert(
      `Mail to save has id "${mails[selectedIndex!].id}" and subject "${mails[selectedIndex!].subject}"`,
    );
    let requestUrl = `https://${process.env.PUBLIC_HOSTNAME}/api/mail/${mails[selectedIndex!].id}/${mails[selectedIndex!].subject}`;
    if (currentFolder === null) {
      requestUrl += "/*/*"
    }
    else {
      requestUrl += `/${currentFolder.driveID}/${currentFolder.id}`
    }
    const response = await Axios.post(requestUrl, {},
    { headers: { Authorization: `Bearer ${token}` }});

  };

  const getJoinedTeams =  React.useCallback(async () => {
    const response = await Axios.get(`https://${process.env.PUBLIC_HOSTNAME}/api/joinedTeams`,
    { headers: { Authorization: `Bearer ${token}` }});
    setCurrentFolder(null);
    return response.data;
  }, [token]);

  const getFolders = async (driveId: string, folderId: string, name: string, parentFolder?: IFolder) => {
    let requestUrl = `https://${process.env.PUBLIC_HOSTNAME}/api/`;
    if (driveId === folderId && driveId !== "*") {
      requestUrl += `TeamRootFolders/${driveId}/${name}`;
    }
    else {
      requestUrl += `folders/${driveId}/${folderId}`;
    }
    const response = await Axios.get(requestUrl,
    { headers: { Authorization: `Bearer ${token}` }});
    if (driveId !== "*" && folderId !== "*") {
      setCurrentFolder({id: folderId, driveID: driveId, parentFolder: parentFolder !== undefined ? parentFolder : currentFolder, name: name})
    }
    else {
      setCurrentFolder(null);
    }
    return response.data;
  };

  useEffect(() => {
    if (inTeams === true) {
      authentication.getAuthToken({
          resources: [`api://${process.env.PUBLIC_HOSTNAME}/${process.env.TAB_APP_ID}`],
          silent: false
      } as authentication.AuthTokenRequestParameters).then(token => {
        getMails(token);
        setToken(token);
        app.notifySuccess();
      }).catch(message => {
          setError(message);
          app.notifyFailure({
              reason: app.FailedReason.AuthFailed,
              message
          });
      });
    } else {
        setEntityId("Not in Microsoft Teams");
    }
  }, [inTeams]);

  useEffect(() => {
    if (context) {
      setEntityId(context.page.id);
    }
  }, [context]);

  useEffect(() => {
    if (context) {
      switch (context.app.host.name) {
        case "Teams":
          setDialogContent(<Teams getJoinedTeams={getJoinedTeams} currentFolder={currentFolder} getFolders={getFolders} mail={mails[selectedIndex!]} />);
          break;
        case "Outlook":
        default:
          setDialogContent(<OneDrive currentFolder={currentFolder} getFolders={getFolders} mail={mails[selectedIndex!]} />);
          break;
      }
    }
  }, [token, currentFolder, selectedIndex]);

  useEffect(() => {
    if (mails.length > 0) {
      let listItems: ListItemProps[] = [];
      mails.forEach((m) => {
        listItems.push({ header: m.from, content: m.subject, media: m.hasAttachments ? (attachmentIcon) : "", headerMedia: m.receivedDateTime, endMedia: m.alreadyStored ? savedIcon : "" });
      });
      setMailItems(listItems);
    }
  }, [mails]);

  /**
   * The render() method to create the UI of the tab
   */
  return (
    <Provider theme={theme}>
      <Flex fill={true} column styles={{
          padding: ".8rem 0 .8rem .5rem"
      }}>
        <Flex.Item>
          <div className="button">
          <Dialog
              cancelButton="Cancel"
              confirmButton="Save here"
              content={dialogContent}
              // onCancel={onCancel}
              onConfirm={saveMail}
              // onOpen={onOpen}
              // open={open}            
              header="Select storage location"
              trigger={<Button content="Save Mail" primary disabled={typeof selectedIndex === 'undefined' || (selectedIndex!<0)} />}
            />
          </div>
        </Flex.Item>
        <Flex.Item>
          <div>
            <List
              selectable
              selectedIndex={selectedIndex}
              onSelectedIndexChange={(e, newProps) => {                    
                setSelectedIndex(newProps!.selectedIndex);
              }}
              items={mailItems}
            />
          </div>
        </Flex.Item>
      </Flex>
    </Provider>
  );
};
