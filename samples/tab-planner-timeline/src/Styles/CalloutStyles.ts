import {
  getTheme,
  mergeStyles,
  mergeStyleSets,
  FontWeights,
} from "@fluentui/react";

import { 
  ICategoryData
} from '../models';


const palette = getTheme().palette;

export const calloutTitleStyles = mergeStyles({
  marginBottom: '10px',
  color: palette.themeDarker,
  fontWeight: FontWeights.semibold,
  fontSize: '18px'
});

export const calloutStyles = mergeStyleSets({
  callout: {
    width: 320,
    padding: "20px 24px",
  },
  title: {
    marginBottom: 12,
    fontWeight: FontWeights.semilight,
  },
});

export const labelsBlockStyle = mergeStyles({
  paddingBottom: '10px',
  marginLeft: '0px'                             
});

export const labelItemStyle = mergeStyles({
  display: 'inline-block', 
  paddingRight: '3px', 
  marginBottom: '5px'
});

export const bucketLabelStyle = mergeStyles({
  marginTop: '-8px',
  paddingBottom: '5px',  
  fontSize: '16px',
  fontWeight: FontWeights.bold  
});

export const sectionTitleStyle = mergeStyles({
  display: 'inline-block',
  paddingBottom: '3px',
  fontSize: '16px',
  fontWeight: FontWeights.semibold
});

export const sectionHeadingStyle = mergeStyles({
  color: palette.themeDarker,
  fontSize: '16px',
  fontWeight: FontWeights.semibold
});

export const priorityStatusStyle = mergeStyles({
  paddingLeft: '5px',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: FontWeights.semilight
});

export const calloutNotesStyle = mergeStyles({
  marginBottom: '10px',
  fontSize: '14px'
});

export const checklistHeadingStyle = mergeStyles({
  color: palette.themeDarker,
  fontSize: '16px',
  fontWeight: FontWeights.semibold
});

export const checklistListStyle = mergeStyles({
  marginTop: '0px',
  alignItems: 'center',
  paddingBottom: '5px'
});

export const checklistItemStyle = mergeStyles({
  display: 'inline-block', 
  paddingRight: '3px',   
});

export const completeLabelStyle = mergeStyles({
  display: 'inline-block',
  paddingRight: '3px',  
  verticalAlign: 'middle'
});

export const competedItemStyle = mergeStyles({
  display: 'inline-block',
  paddingRight: '3px',  
  textDecoration: 'line-through',  
  verticalAlign: 'middle'
});

export const urgentIconStyle = mergeStyles({
  color: palette.red,
  marginRight: '3px',
});

export const lowIconStyle = mergeStyles({
  color: palette.blue,
  marginRight: '3px',
});

export const importantIconStyle = mergeStyles({
  color: palette.red,
  marginRight: '3px',
});

export const CompletedIconStyle = mergeStyles({
  color: palette.green,
  marginRight: '3px',
});

export const CheckListLineItemStyle = mergeStyles({
  display: 'flex'
});

 // function to style the label
export function labelItemColorStyle(label: ICategoryData): string {
  const className = mergeStyles({
    padding: "1px 5px",
    fontSize: "10px",
    backgroundColor: label.backgroundColor,
    color: label.color,
    borderRadius: '5px'
  });

  return className;
}
  