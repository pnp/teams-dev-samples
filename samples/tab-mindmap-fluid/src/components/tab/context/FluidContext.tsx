import React, { useState, useEffect } from "react";


import { FluidModelContext } from "./FluidModelContext";
import { MindMapFluidModel } from "../model/MindMapFluidModel";

import {   MindMapUser, getContainer } from "../util";


export const FluidContext: React.FC<{ id:string,user:MindMapUser,children: any }> = ({id,user, children }) => {
    const [model, setModel] = useState<MindMapFluidModel | undefined>();
    const [loadedContainer, setLoadedContainer] = useState<boolean>(false);
    const [prevId, setPrevId] = useState<string>("");
    
    useEffect(() => {
  
        const loadModel = async () => {
            if(!loadedContainer ||prevId !== id ){
               
           const { container, services } = await getContainer(id, user);;
            setModel(new MindMapFluidModel(container, services));
            setLoadedContainer(true);
            setPrevId(id);
            }
        };
        console.log("loadModel triggerd");
        loadModel();
    },[id,user,prevId,loadedContainer]);

    if (!model) return <div />;

    return <FluidModelContext.Provider value={model}>{children}</FluidModelContext.Provider>;
};