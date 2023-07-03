import { useContext } from "react";
import { FluidModelContext } from "../context/FluidModelContext";

export const useFluidModelContext = () => useContext(FluidModelContext);