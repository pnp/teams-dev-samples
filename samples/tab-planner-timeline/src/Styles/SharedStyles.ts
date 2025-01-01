import {
  getTheme,
  mergeStyles,
} from "@fluentui/react";

const palette = getTheme().palette;

export const tabStyle = mergeStyles({
  WebkitBoxAlign: "center",
  msFlexAlign: "center",
  alignItems: "center",        
  borderRadius: "3px",
  display: "inline-flex",
  height: "2em",
  WebkitBoxPack: "center",
  msFlexPack: "center",
  justifyContent: "center",
  lineHeight: 1.5,
  paddingLeft: ".75em",
  paddingRight: ".75em",
  whiteSpace: "nowrap",
});

 
export const isMediumStyle = mergeStyles({
  fontSize: "1rem"
});

export const yearMonthStyle = mergeStyles({
  backgroundColor: palette.themePrimary,
  border: `1px solid ${palette.themePrimary}`,
  color: palette.white,
});


