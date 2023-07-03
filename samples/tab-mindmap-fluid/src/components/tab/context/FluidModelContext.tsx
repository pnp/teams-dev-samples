import { createContext } from "react";
import { MindMapFluidModel } from "../model/MindMapFluidModel";



export const FluidModelContext = createContext<MindMapFluidModel>({} as MindMapFluidModel);