import * as React from "react";
import { Provider, Flex, Header, Input, Text, Button, Checkbox } from "@fluentui/react-northstar";
import * as microsoftTeams from "@microsoft/teams-js";
import { useState, useEffect } from "react";
import { getQueryVariable, useTeams } from "msteams-react-base-component";

/**
 * Implementation of the Action Config in Azure configuration page
 */
export const ActionConfigInAzureMessageExtensionConfig = () => {

    const [{ inTeams, theme }] = useTeams();
    const [siteID, setSiteID] = useState<string>();
    const [listID, setListID] = useState<string>();
    const [useSearch, setUseSearch] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>();

    useEffect(() => {
        const initialSiteID = getQueryVariable("siteID");
        setSiteID(initialSiteID);
        const initialListID = getQueryVariable("listID");
        setListID(initialListID);
        const useSearchStr = getQueryVariable("useSearch");
        setUseSearch(useSearchStr?.toLowerCase() === "true" ? true : false);
        const initialSearchQuery = getQueryVariable("searchQuery");
        setSearchQuery(initialSearchQuery);
        if (inTeams === true) {
            microsoftTeams.appInitialization.notifySuccess();
        }
    }, [inTeams]);

    const onUseSearchChanged = (e, data) => {
        setUseSearch(data.checked);
    };

    const saveConfig = () => {
        microsoftTeams.authentication.notifySuccess(JSON.stringify({
            siteID: siteID,
            listID: listID,
            useSearch: useSearch,
            searchQuery: searchQuery
        }));
    };

    return (
        <Provider theme={theme} styles={{ height: "80vh", width: "90vw", padding: "1em" }}>
            <Flex fill={true}>
                <Flex.Item>
                    <div>
                        <Header content="Action Config in Azure configuration" />
                        <Text content="Site ID: " />
                        <Input placeholder="Enter a site id"
                            fluid
                            clearable
                            value={siteID}
                            disabled={useSearch}
                            onChange={(e, data) => {
                                if (data) {
                                    setSiteID(data.value);
                                }
                            }}
                            required />
                        <Text content="List ID: " />
                        <Input placeholder="Enter a list id"
                            fluid
                            clearable
                            value={listID}
                            disabled={useSearch}
                            onChange={(e, data) => {
                                if (data) {
                                    setListID(data.value);
                                }
                            }}
                            required />
                        <p/>
                        <Checkbox label="Use search to retrieve files instead"
                                  toggle
                                  checked={useSearch}
                                  onChange={onUseSearchChanged} />
                        <br/>
                        <Text content="Search Query: " />
                        <Input placeholder="Enter a search query such as ContentTypeId:0x0101*"
                            fluid
                            clearable
                            value={searchQuery}
                            disabled={!useSearch}
                            onChange={(e, data) => {
                                if (data) {
                                    setSearchQuery(data.value);
                                }
                            }}
                            required />
                        <p/>
                        <Button onClick={() => saveConfig()} primary>OK</Button>
                    </div>
                </Flex.Item>
            </Flex>
        </Provider>
    );
};
