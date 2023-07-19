import React from "react";
import { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import { WhosNextTab } from "./WhosNext";
import WhosNextConfig from "./WhosNextConfig";
import { LiveCanvasPage } from "./LiveCanvasPage";
import { DiscussPatientsPage } from "./DiscussPatientsPage";
import "./App.css";
import { FrameContexts, app } from "@microsoft/teams-js";
import FluidService from "../services/fluidLiveShare.js";

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
  const [presence, setPresence] = useState(null);

  const initialize = async () => {
    await app.initialize();
    app.notifySuccess();
    const context = await app.getContext();
    if (context.page.frameContext === FrameContexts.sidePanel || context.page.frameContext === FrameContexts.meetingStage) {
      await FluidService.connect();
      //const people = await FluidService.getPersonList();
      const presence = await FluidService.getPresence();
      setPresence(presence);
    }
    else {
      setPresence(null);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <Router>
      <Routes>
        <Route exact path={"/"} element={<DiscussPatientsPage presence={presence} />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/termsofuse" element={<TermsOfUse />} />
        <Route path="/tab" element={<WhosNextTab presence={presence} />} />
        <Route path="/imageshare" element={<LiveCanvasPage />} />
        <Route path="/config" element={<WhosNextConfig />} />
      </Routes>
    </Router>
  );
}
