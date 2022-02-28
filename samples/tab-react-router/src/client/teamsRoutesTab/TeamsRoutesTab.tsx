import * as React from "react";
import { Provider, Flex, Text, Button, Header } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import { HashRouter, Route, Router, Routes, Navigate} from "react-router-dom";
import { Home } from "./routeComponents/Home";
import { PageWithURLParameter } from "./routeComponents/PageWithURLParameter";
import { Page1 } from "./routeComponents/Page1";
import { Page2 } from "./routeComponents/Page2";
import  PagewithClassComponent  from "./routeComponents/PagewithClassComponent";


import { MyAppHeader } from "./MyAppHeader";
import { MyAppFooter } from "./MyAppFooter";
import { NotFound } from "./NotFound";
import { createHashHistory } from 'history';


/**
 * Implementation of the TeamsRoutes Tab content page
 */
export const TeamsRoutesTab = () => {

    const [{ inTeams, theme, context }] = useTeams();
    const [entityId, setEntityId] = useState<string | undefined>();
    const history = createHashHistory();
    useEffect(() => {
        if (inTeams === true) {
            microsoftTeams.appInitialization.notifySuccess();
        } else {
            setEntityId("Not in Microsoft Teams");
        }
        //window.location.hash=`/home/`;
    }, [inTeams]);

    useEffect(() => {
        if (context) {
            setEntityId(context.entityId);
        }
    }, [context]);

    /**
     * The render() method to create the UI of the tab
     */
    return (
        <Provider theme={theme}>
            <MyAppHeader></MyAppHeader>
            <HashRouter window={window}>
                <Routes>
                    <Route path="/" element={<Navigate replace to="/home/" />}></Route>
                    <Route path="/home/" element={<Home />}></Route>
                    <Route path="/Page1/" element={<Page1 />}></Route>
                    <Route path="/Page2/" element={<Page2 />}></Route>
                    <Route path="/Page3/" element={<PagewithClassComponent />}></Route>
                    <Route path="/PageWithURLParameter/:detailid/" element={<PageWithURLParameter />}></Route>
                    <Route path="*" element={<NotFound></NotFound>}></Route>
                </Routes>
            </HashRouter>
            <MyAppFooter></MyAppFooter>
            {/* <Flex fill={true} column styles={{
                padding: ".8rem 0 .8rem .5rem"
            }}>
                <Flex.Item>
                    <Header content="This is your tab" />
                </Flex.Item>
                <Flex.Item>
                    <div>
                        <div>
                            <Text content={entityId} />
                        </div>

                        <div>
                            <Button onClick={() => alert("It worked!")}>A sample button</Button>
                        </div>
                    </div>
                </Flex.Item>
                <Flex.Item styles={{
                    padding: ".8rem 0 .8rem .5rem"
                }}>
                    <Text size="smaller" content="(C) Copyright mypersorg" />
                </Flex.Item>
            </Flex> */}
          
        </Provider>
    );
};
