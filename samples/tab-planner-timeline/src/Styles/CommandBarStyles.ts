import {
  mergeStyles,
  IStackStyles,
  getTheme,
} from "@fluentui/react";

const palette = getTheme().palette;

export const stackStyles: IStackStyles = {
  root: {
    paddingTop: 5,    
    height: 40,
    width: '100%',
  },
};

export const BucketLabelStyle = mergeStyles({
  paddingRight: '5px', 
  verticalAlign: "middle" 
});


export const barDivStyle = mergeStyles({
  display: 'flex',
  alignItems: 'center'
});

export const activeTasksCheckboxStyle = mergeStyles({
  paddingLeft: '3px',  
  verticalAlign: "middle"  
});

export const refreshButtonStyle = mergeStyles({
  width: '30px', 
  height: '30px', 
  marginLeft: '5px'
});

export const bucketDropdownStyle = mergeStyles({
  dropdown: {
    paddingleft: 5,
    width: 250,
    verticalAlign: "middle",
  },
});
