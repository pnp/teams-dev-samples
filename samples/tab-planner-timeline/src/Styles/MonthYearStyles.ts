import {
  getTheme,
  mergeStyles,
} from "@fluentui/react";

import { 
  tabStyle,
  isMediumStyle,
  yearMonthStyle
} from ".";

const palette = getTheme().palette;

export const timelineStyle = mergeStyles({
  display: "flex",
  WebkitBoxOrient: "vertical",
  WebkitBoxDirection: "normal",
  msFlexDirection: "column",
  flexDirection: "column"
});

export const timelineHeaderStyle = mergeStyles({
  width: "4em",
  minWidth: "4em",
  maxWidth: "8em",
  wordWrap: "normal",
  textAlign: "center",
  display: "flex",
  WebkitBoxPack: "center",
  justifyContent: "center",  
});
  
export const timelineYearStyle = mergeStyles(
  tabStyle, 
  isMediumStyle, 
  yearMonthStyle
);

export const timelineMonthStyle = mergeStyles(
  tabStyle, 
  yearMonthStyle
);

