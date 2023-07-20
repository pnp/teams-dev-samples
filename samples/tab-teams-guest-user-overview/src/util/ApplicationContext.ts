import { BaseComponentContext } from "@microsoft/sp-component-base";
import { GraphFI } from "@pnp/graph/presets/all";
import * as React from "react";
import { IGraphProvider } from "../providers/GraphProvider";
import { ICacheManager } from "../providers/CacheManager";

export interface IApplicationContext {
    SPFxContext: BaseComponentContext;
    Graph: GraphFI;
    GraphProvider: IGraphProvider;
    Storage: ICacheManager;

}

export const ApplicationContext = React.createContext<IApplicationContext>(null);