import { useContext } from "react";
import { Welcome } from "./sample/Welcome";
import { TeamsFxContext } from "./Context";
import config from "../lib/config";
import { DocumentPack } from "./DocumentPack/DocumentPack";

const showFunction = Boolean(config.apiName);

export default function Tab() {
  const { themeString } = useContext(TeamsFxContext);
  return (
    <div
      className={themeString === "default" ? "light" : themeString === "dark" ? "dark" : "contrast"}
    >
      <DocumentPack />
      {/* <Welcome showFunction={showFunction} /> */}
    </div>
  );
}
