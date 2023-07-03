import { useContext, useEffect, useState } from "react";
import { TeamsFxContext } from "./Context";

import { MindMapContainer } from "./tab/MindMapContainer";
import { FluidContext } from "./tab/context/FluidContext";
import { app, pages } from "@microsoft/teams-js";
import { MindMapUser, containerIdQueryParamKey, getAzureMemberFromCtx } from "./tab/util";

export default function Tab() {
  const { themeString } = useContext(TeamsFxContext);
  const [id, setId] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<MindMapUser | undefined>(undefined);
  

  useEffect(() => {
    const getId = async (): Promise<void> => {
      if (!id) {
        await app.initialize();
        app.getContext().then(async (ctx: any) => {
          setUser(getAzureMemberFromCtx(ctx?.user));
          let containerId = undefined;
          if (ctx.page.frameContext === "meetingStage") {
            const urlParams = new URLSearchParams(window.location.search);
            containerId = urlParams.get(containerIdQueryParamKey);
          } else {
            const instanceSettings = await pages.getConfig();
            const url = new URL(instanceSettings.contentUrl);
            containerId = url.searchParams.get(containerIdQueryParamKey);
          }
          if (!containerId) {
            throw Error("containerId not found in the URL");
          }
          setId(containerId);

        });

      }

    };
    getId();
  }, [id]);
  return (
    <div
      className={themeString === "default" ? "light" : themeString === "dark" ? "dark" : "contrast"}
    >
      Containerid:{id}<br />
      {id && user ? <FluidContext id={id} user={user}>
        <MindMapContainer />
      </FluidContext>
        : <div>Loading ID</div>
      }
    </div>
  );
}
