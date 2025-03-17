import {
  mergeStyles,
  IStackStyles,
  FontWeights,
  getTheme,
} from "@fluentui/react";

export class CommandBarStyles {
  public static readonly palette = getTheme().palette;

  public static stackStyles: IStackStyles = {
    root: {
      paddingTop: 5,    
      height: 40,
      width: '100%',
    },
  };

  public static BucketLabelStyle = mergeStyles({
    paddingRight: '5px', 
    verticalAlign: "middle" 
  });

  public static barDivStyle = mergeStyles({
    display: 'flex',
    alignItems: 'center'
  });

  public static activeTasksSwitchStyle = mergeStyles({
    label: {
      paddingLeft: '0',
      paddingRight: '0',
      verticalAlign: "middle",      
    },
    minWidth: '110px',
    paddingLeft: '3px',  
    verticalAlign: "middle"  
  });

  public static addPlanSwitchStyle = mergeStyles({
    label: {
      paddingLeft: '0',
      paddingRight: '0',
      verticalAlign: "middle",      
    },
    minWidth: '110px',
    paddingLeft: '3px',  
    verticalAlign: "middle"  
  });

  public static refreshButtonStyle = mergeStyles({
    width: '30px', 
    height: '30px', 
    marginLeft: '5px',
    ':hover': {
      backgroundColor: this.palette.themeLight,
      color: 'black',
      FontWeights: FontWeights.bold,
    },    
  });

  public static bucketDropdownStyle = mergeStyles({
    dropdown: {
      paddingleft: 5,
      width: 250,
      verticalAlign: "middle",
    },
  });
}
