import * as React from "react";
import { IBoxContentExplorerProps } from "./IBoxContentExplorerProps";
import ContentExplorer from "box-ui-elements/es/elements/content-explorer";
import messages from "box-ui-elements/i18n/en-US";
import { boxService } from "../../../services/services";
import { useObservable } from "../../../hooks/observableHook";
import "box-ui-elements/dist/explorer.css";
import TopMessageBar from "../../../utilities/messageBar";
import BoxLogin from "./Login";
import styles from "./BoxContentExplorer.module.scss";

const BoxFiles: React.FC<IBoxContentExplorerProps> = (props) => {
  const boxToken = useObservable(boxService.boxToken);
  const errorMessage = useObservable(boxService.errorMessage);
  let hasCachedToken: boolean = false;
  React.useEffect(()=>{
    async function getCachedToken(){
      await boxService.GetLocalStorageToken();
    }
    getCachedToken().then(res=>console.log("Cached token retrived from the session storage."));
  },[]);

  if (localStorage.getItem(`${props.userObjectId}-boxAccessToken`)) {
    hasCachedToken = true;
  }

  return (
    <div className={styles.boxContentExplorer}>
      {errorMessage && <TopMessageBar message={errorMessage} />}
      {!boxToken && !hasCachedToken && <BoxLogin />}
      {boxToken && (
        <ContentExplorer
          language="en-US"
          messages={messages}
          token={boxToken}
          contentPreviewProps={{
            contentSidebarProps: {
              hasActivityFeed: true,
              hasSkills: true,
              hasMetadata: true,
              detailsSidebarProps: {
                hasProperties: true,
                hasNotices: true,
                hasAccessStats: true,
                hasVersions: true,
              },
            },
          }}
          rootFolderId={props.folderId ? props.folderId : 0}
        />
      )}
    </div>
  );
};

export default BoxFiles;
