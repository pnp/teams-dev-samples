import {
  getTheme,
  DefaultPalette,
  mergeStyles,
} from "@fluentui/react";

const palette = getTheme().palette;

export const pagePaddingStyle = mergeStyles({
  paddingTop: "0.5rem",
  paddingBottom: "2rem",
  paddingLeft: "2rem",
  paddingRight: "2rem",
  marginTop: "40px",
  top: '40px', 
  position: 'sticky', 
  zIndex: 100
});

export const listedTaskStyle = mergeStyles({
  paddingBottom: '10px', 
  marginLeft: "-0.5rem",
  fontSize: '20px' 
});

export const BucketNameStyle = mergeStyles({
  fontSize: "1.5rem",
  fontWeight: 600,  
  marginLeft: "-1rem",
  paddingBottom: "1rem",
});

export const errorStyle = mergeStyles({
  color: DefaultPalette.redDark,
  fontWeight: "bold"
});

export const spinnerDiv = mergeStyles({
  maxWidth: "500px",  
});

export const spinnerStyle = mergeStyles({
  paddingLeft: "10rem",
  paddingTop: "2rem",
  color: "#5b5fc7",  
  Label: { 
    color: "#5b5fc7"
  }  
});

export function CommandBarBlockStyle(themeString: string): string {
  const className = mergeStyles({
    position: "fixed", 
    top: 0, 
    width: "100%", 
    height: '45px', 
    background: themeString === "dark" ? palette.themeDarker : palette.themeLighterAlt, 
    zIndex: 1000,
  });

  return className;
  }