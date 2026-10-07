import {
  mergeStyles,
  getTheme
} from "@fluentui/react";

export class ConfigStyles {
  public static readonly palette = getTheme().palette;


  public static configHeading = mergeStyles ({
    fontSize: "1.5em",
    fontWeight: "bold",
    paddingBottom: "5px",
  });

  public static configDropdownLabel = mergeStyles ({
    fontSize: "14px",
    fontWeight: "400",
    paddingTop: "5px",    
    marginBottom: "4px",
  });

  public static configFilterLabel = mergeStyles({
    fontSize: "16px",
    fontWeight: "700",
    marginTop: "10px",
    marginBottom: "5px",
  });
  
  public static addNewPlanButton = mergeStyles({
    marginTop: '10px',
  });
}

