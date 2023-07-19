/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { InkingManager } from "@microsoft/live-share-canvas";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 *
 * @param {LiveCanvas} liveCanvas Fluid LiveCanvas Data object
 * @param {HTMLElement} hostingElement Hosting Element where LiveCanvas needs to be attached.
 * @returns LiveCanvas callback helpers and inking manager.
 */
export const useLiveCanvas = (liveCanvas, hostingElement) => {
  const startedInitializingRef = useRef(false);
  const [inkingManager, setInkingManager] = useState(undefined);
  const [error, setError] = useState(undefined);

  const startInkingManager = useCallback(async () => {
    if (!liveCanvas || !hostingElement || startedInitializingRef.current) {
      return;
    }
    startedInitializingRef.current = true;

    try {
      const inkingHost = hostingElement;
      const inkManager = new InkingManager(inkingHost);
      await liveCanvas.initialize(inkManager);

      // Activate the InkingManager so it starts handling pointer input
      inkManager.activate();
      setInkingManager(inkManager);
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }, [liveCanvas, hostingElement]);

  useEffect(() => {
    startInkingManager();
  }, [startInkingManager]);

  return {
    inkingManager,
    error,
  };
};