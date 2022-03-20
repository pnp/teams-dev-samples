import { useState } from "react";
import { Button } from "@fluentui/react-northstar";
import { Filter } from "../lib/types";
import ErrorMessage from "./ErrorMessage";

interface FilterUploadProps {
  onFiltersUploaded(filters: Filter[]): void;
}

export default function FilterUpload(props: FilterUploadProps) {
  const [errorMessage, setErrorMessage] = useState("");

  function triggerFileUpload() {
    document.getElementById("fileUploadElt")?.click();
  }

  function xmlUploaded(evt: any) {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const parser = new DOMParser();

        const xmlStr = e.target?.result as string;
        const xml = parser.parseFromString(xmlStr, "text/xml");
        if (xml.lookupNamespaceURI("apps") !== "http://schemas.google.com/apps/2006") {
          setErrorMessage("File isn't a Gmail filter export");
          return;
        }
        const entries = xml.getElementsByTagName("entry");
        if (entries.length === 0) {
          setErrorMessage("Export file doesn't contain any filters");
          return;
        }
        const filtersArray = Array.from(entries).map(e =>
          Array.from(e.getElementsByTagName("apps:property")).reduce(
            (dict, prop) => ({
              ...dict,
              [prop.getAttribute("name") as string]: prop.getAttribute("value")
            }),
            {}) as Filter);
        props.onFiltersUploaded(filtersArray);
      } catch (err: any) {
        setErrorMessage(JSON.stringify(err));
      }
    };

    reader.readAsText(evt.target.files[0]);
  }

  return (
    <>
      <Button primary content="Upload XML" onClick={triggerFileUpload} />
      <input id="fileUploadElt" style={{ "display": "none" }} type="file" onChange={xmlUploaded} />

      {errorMessage && <ErrorMessage message={errorMessage} />}
    </>
  )
}