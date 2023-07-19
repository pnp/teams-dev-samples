import { InkingManager, InkingTool } from "@microsoft/live-share-canvas";
import { UserMeetingRole } from "@microsoft/live-share";
import { useEffect, useState, useRef, useCallback } from "react";
import FluidService from "../services/fluidLiveShare.js";
import { app } from "@microsoft/teams-js";
import { DefaultButton, PrimaryButton } from "@fluentui/react";
import "./LiveCanvasPage.scss";
import fluidLiveShare from "../services/fluidLiveShare.js";

/**
* Live image canvas page.
*
* @remarks
*
* @param {string} name name of the patient.
* @param {string} specialist name of specialist who started the page.
* @param {void} onDismiss dismiss callback for calling component.
*/
export const LiveCanvasPage = (name, specialist, onDismiss) => {
  const [inkManager, setInkManager] = useState(undefined);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const filePickerRef = useRef(null);
  const ALLOWED_ROLES = [UserMeetingRole.organizer, UserMeetingRole.presenter, UserMeetingRole.attendee];
  const divRef = useRef();

  const initialize = async () => {
    await app.initialize();
    app.notifySuccess();
    await FluidService.connect();
    const liveCanvas = await FluidService.getCanvas();
    const internalInkManager = new InkingManager(divRef.current);

    // Toggle Live Canvas cursor enabled state
    liveCanvas.isCursorShared = true;
    await liveCanvas.initialize(internalInkManager, ALLOWED_ROLES);

    // Set default tool to pen
    internalInkManager.tool = InkingTool.pen;
    internalInkManager.penBrush.type = "pen";
    internalInkManager.penBrush.color = { r: 255, g: 0, b: 0 };
    internalInkManager.penBrush.tipSize = 4;

    // Activate the InkingManager so it starts handling pointer input
    internalInkManager.activate();

    const image = await FluidService.getLiveImage(name.name);
    if (image && image.length > 0) {
      console.log(image);
      setImagePreview(image);
    }

    FluidService.onNewData((peopleMap) => {
      //json = JSON.parse(image);
      //if (image && Array.isArray(image) && image.length > 0) {
      if (peopleMap.currentImage && peopleMap.currentImage.length > 0) {
        console.log(peopleMap.currentImage);
        setImagePreview(peopleMap.currentImage);
      }
    });

    setInkManager(internalInkManager);
    setLoading(false);
  };

  useEffect(() => {
    initialize();
  }, []);

  const setToPen = useCallback(() => {
    if (inkManager) {
      inkManager.tool = InkingTool.pen;
      inkManager.penBrush.type = "pen";
      inkManager.penBrush.color = { r: 255, g: 0, b: 0 };
      inkManager.penBrush.tipSize = 4;
    }
  }, [inkManager]);

  const setToLaserPointer = useCallback(() => {
    if (inkManager) {
      inkManager.tool = InkingTool.laserPointer;
    }
  }, [inkManager]);

  // const setToHighlighter = useCallback(() => {
  //   if (inkManager) {
  //     inkManager.tool = InkingTool.highlighter;
  //   }
  // }, [inkManager]);

  const setToArrow = useCallback(() => {
    if (inkManager) {
      inkManager.tool = InkingTool.line;
      inkManager.lineBrush.endArrow = "open";
      inkManager.lineBrush.color = { r: 255, g: 0, b: 0 };
      inkManager.lineBrush.tipSize = 4;
    }
  }, [inkManager]);

  const setToEraser = useCallback(() => {
    if (inkManager) {
      inkManager.tool = InkingTool.pointEraser;
    }
  }, [inkManager]);

  // const setToBlackBrush = useCallback(() => {
  //   if (inkManager) {
  //     inkManager.tool = InkingTool.pen;
  //     inkManager.penBrush.type = "pen";
  //     inkManager.penBrush.color = { r: 0, g: 0, b: 0 };
  //     inkManager.penBrush.tipSize = 4;
  //   }
  // }, [inkManager]);

  // const setToBlueBrush = useCallback(() => {
  //   if (inkManager) {
  //     inkManager.tool = InkingTool.pen;
  //     inkManager.penBrush.type = "pen";
  //     inkManager.penBrush.color = { r: 0, g: 0, b: 255, a: 1 };
  //     inkManager.penBrush.tipSize = 4;
  //   }
  // }, [inkManager]);

  const setToRedBrush = useCallback(() => {
    if (inkManager) {
      inkManager.tool = InkingTool.pen;
      inkManager.penBrush.color = { r: 255, g: 0, b: 0 };
      inkManager.penBrush.tipSize = 8;
    }
  }, [inkManager]);

  const clearCanvas = useCallback(() => {
    if (inkManager) {
      inkManager.clear();
    }
  }, [inkManager]);

  const previewFile = (e) => {
    // Reading New File (open file Picker Box)
    const reader = new FileReader();
    // Gettting Selected File (user can select multiple but we are choosing only one)
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
    // As the File loaded then set the stage as per the file type
    reader.onload = (readerEvent) => {
      if (selectedFile.type.includes("image")) {
        FluidService.addImage(readerEvent.target.result);
        setImagePreview(readerEvent.target.result);
      }
    };
  }

  const saveImage = () => {
    //const savedImage = inkManager.exportSVG();
    //FluidService.saveImage(name.name, savedImage, name.specialist);
    inkManager.clear();
    fluidLiveShare.addImage('');
    name.onDismiss();
  }

  const dismiss = () => {
    inkManager.clear();
    fluidLiveShare.addImage('');
    name.onDismiss();
  }

  return (
    <>
      {loading && <div>Loading...</div>
      }
      <div id="inkingRoot" style={{ display: 'flex', flexDirection: "column", marginTop: '16px', height: '70%', width: '100%', border: '1px solid black' }}>
        {/* <img src={require('../images/tekening.png')} /> */}
        <div id="inkingHost" ref={divRef} style={{ height: '100%', width: '100%', backgroundPosition: '50% 50%', backgroundRepeat: "no-repeat", backgroundImage: `url(${imagePreview})` }} >
        </div>
      </div>
      {!loading &&
        <div style={{ height: '15%' }}>
          <div>
            <button className="toolbutton" onClick={setToPen}>Pen</button>
            <button className="toolbutton" onClick={setToRedBrush}>Brush</button>
            <button className="toolbutton" onClick={setToArrow}>Arrow</button>
            {/* <button className="toolbutton" onClick={setToHighlighter}>Highlighter</button> */}
            <button className="toolbutton" onClick={setToLaserPointer}>Laser Pointer</button>
            <button className="toolbutton" onClick={setToEraser}>Eraser</button>
            {/* <button className="toolbutton" onClick={setToBlueBrush}>Blue brush</button> */}
            {/* <button className="toolbutton" onClick={setToBlackBrush}>Black brush</button> */}
            <button className="toolbutton" onClick={clearCanvas}>Clear</button>
          </div>
          <div className="btn-container">
            <input ref={filePickerRef} accept="image/*" onChange={previewFile} type="file" hidden />
            <button className="toolbutton" onClick={() => filePickerRef.current.click()}>Choose File</button>

          </div>
        </div>
      }
      <div style={{ height: '10%' }}>
        <PrimaryButton text="Save" onClick={() => saveImage()} />
        <DefaultButton text="Cancel" onClick={() => { dismiss() }} />
      </div>
    </>
  );
};