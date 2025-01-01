import {
  getTheme,
  mergeStyles,
} from "@fluentui/react";

import {timelineMarkerStyle} from '.';

const palette = getTheme().palette;

export const timelineContentStyle = mergeStyles({
  padding: "1em 0 0 2em"
});

export const isCompletedStyle = mergeStyles({
  backgroundColor: palette.green,
  color: palette.white,
  border: `1px solid ${palette.green}`,
});

export const darkIsCompletedStyle = mergeStyles({
  backgroundColor: palette.greenLight,
  color: palette.greenLight,
  border: `1px solid ${palette.greenLight}`,
});

export const isOverDueStyle = mergeStyles({
  backgroundColor: palette.red,
  color: palette.red,
  border: `1px solid ${palette.red}`,
});

export const isPrimaryStyle = mergeStyles({
  backgroundColor: palette.blue,
  border: `1px solid ${palette.blue}`,
  color: palette.blue,
});

export const darkIsPrimaryStyle = mergeStyles({
  backgroundColor: palette.blueLight,
  border: `1px solid ${palette.blueLight}`,
  color: palette.blueLight,
});


export const isOutlinedStyle = mergeStyles({
  backgroundColor: "#fff !important",
  border: "0.1em solid #b5b5b5"  
});

export const completedTaskStyle = mergeStyles({
  color: palette.green,
  fontWeight: 400,
});

export const darkCompletedTaskStyle = mergeStyles({
  color: palette.greenLight,
  fontWeight: 400,
});

export const overDueTaskStyle = mergeStyles({
  color: palette.red,
  fontWeight: 400,
});

export const inprogressTaskStyle = mergeStyles({
  color: palette.blue,
  fontWeight: 400,
});

export const darkInprogressTaskStyle = mergeStyles({
  color: palette.blueLight,
  fontWeight: 400,
});


export const notStartedTaskStyle = mergeStyles({
  fontWeight: 400,
});

export const taskItemTitleStyle = mergeStyles({  
  display: "flex",
  verticalAlign: "top",
  paddingTop: 4,
  height: 30,
  whiteSpace: "pre-wrap",
  wordWrap: 'break-word !important',
});

export const infoIconStyle = mergeStyles({
  marginTop: '5px', 
  marginRight: '5px', 
  paddingBottom: '5px', 
  cursor: 'pointer'
});

export const timelineTitleBlockStyle = mergeStyles({
  display: "flex",
  marginLeft: "0.5em",
});

export const priorityTimelineStatusStyle = mergeStyles({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center"  
});

export function timelineRenderStyles(themeString: string, TaskPercentComplete: number, isOverDue: boolean): [string[], string[]] {
    const timelineMarkerClass = [mergeStyles(timelineMarkerStyle)];
    const gridClass = ['ms-Grid'];

    if (TaskPercentComplete === 100) {
      if (themeString === "dark") {
        timelineMarkerClass.push(darkIsCompletedStyle);
        gridClass.push(darkCompletedTaskStyle);
      } else {
        timelineMarkerClass.push(isCompletedStyle);
        gridClass.push(completedTaskStyle);
      }
    } else if (isOverDue) {
      timelineMarkerClass.push(isOverDueStyle);
      gridClass.push(overDueTaskStyle);      
    } else if (TaskPercentComplete === 50) {
      if (themeString === "dark") {
        timelineMarkerClass.push(darkIsPrimaryStyle);
        gridClass.push(darkInprogressTaskStyle);
      } else {
        timelineMarkerClass.push(isPrimaryStyle);
        gridClass.push(inprogressTaskStyle);
      }
    } else {    
      timelineMarkerClass.push(isOutlinedStyle);
      gridClass.push(notStartedTaskStyle);
    }

    return [timelineMarkerClass, gridClass];
  }