import * as React from "react";
import { Provider } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import Editor from "@monaco-editor/react";

/**
 * Implementation of the Context Viewer Tab content page
 */
export const ContextViewerTab = () => {

    const [{ inTeams, theme, themeString, context }] = useTeams();
    const [entityId, setEntityId] = useState<string | undefined>();

    useEffect(() => {
        if (inTeams === true) {
            microsoftTeams.appInitialization.notifySuccess();
        } else {
            setEntityId("Not in Microsoft Teams");
        }
    }, [inTeams]);

    useEffect(() => {
        if (context) {
            setEntityId(context.entityId);
        }
    }, [context]);

    const _printContext = () => {
        return JSON.stringify(context, null, 2);
    };
    
    const _getEditorTheme = () => {
        switch (themeString) {
            case "dark":
                return "vs-dark";
            case "contrast":
                return "hc-black";
            case "default":
            default:
                return "light";
        }
    };

    /**
     * The render() method to create the UI of the tab
     */
    return (
        <Provider theme={theme}>
            {inTeams && (
                <Editor theme={_getEditorTheme()} height="100vh" defaultLanguage="json" defaultValue={ _printContext() } options={ { readOnly: true, automaticLayout: true } }></Editor>
            )}
        </Provider>
    );
};
