import * as React from "react";
import { Provider, Flex, Header, List } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import Axios from "axios";
import { IDocument } from "../../../model/IDocument";

/**
 * Implementation of the Action Config in Azure Task Module page
 */
export const ActionConfigInAzureMessageExtensionAction = () => {
    const [{ inTeams, theme }] = useTeams();
    const [documents, setDocuments] = useState([] as IDocument[]);
    const [selectedListItem, setSelectedListItem] = useState<number>();

    useEffect(() => {
        if (inTeams === true) {
            microsoftTeams.initialize(() => {
                microsoftTeams.getContext((context) => {

                  microsoftTeams.authentication.getAuthToken({
                    successCallback: (token: string) => {
                      loadFiles(token);
                      microsoftTeams.appInitialization.notifySuccess();
                    },
                    failureCallback: (message: string) => {
                      microsoftTeams.appInitialization.notifyFailure({
                          reason: microsoftTeams.appInitialization.FailedReason.AuthFailed,
                          message
                      });
                    },
                    resources: [`api://${process.env.HOSTNAME}/${process.env.GRAPH_APP_ID}`]
                  });
                });
              });
        }
    }, [inTeams]);

    const loadFiles = (token: string) => {
      if (token) {
        Axios.get(`https://${process.env.HOSTNAME}/api/files`, {
                        responseType: "json",
                        headers: {
                          Authorization: `Bearer ${token}`
                        }
            }).then(result => {
                const docs: IDocument[] = [];
                result.data.forEach(d => {
                    docs.push({ name: d.name, id: d.id, author: d.author, modified: new Date(d.modified), url: d.url });
                });
                setDocuments(docs);
            })
            .catch((error) => {
              console.log(error);
            });
      }
    };
    const listItemSelected = (e, newProps) => {
        const selectedDoc = documents.filter(doc => doc.id === newProps.items[newProps.selectedIndex].key)[0];
        microsoftTeams.tasks.submitTask({
          doc: selectedDoc
        });
        setSelectedListItem(newProps.selectedIndex);
    };

    let listItems: any[] = [];
    if (documents) {
        documents.forEach((doc) => {
        listItems.push({
            key: doc.id,
            header: doc.name,
            headerMedia: doc.modified.toLocaleDateString(),
            content: doc.author
        });
      });
    }

    return (
        <Provider theme={theme} styles={{ height: "100vh", width: "90vw", padding: "1em" }}>
            <Flex fill={true} column styles={{
                padding: ".8rem 0 .8rem .5rem"
            }}>
                <Flex.Item>
                    <div>
                    <Header content="Select a document: " />
                    <List selectable
                            selectedIndex={selectedListItem}
                            onSelectedIndexChange={listItemSelected}
                            items={listItems}
                            />
                    </div>
                </Flex.Item>
            </Flex>
        </Provider>
    );
};
