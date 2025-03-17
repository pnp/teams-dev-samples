import { useContext } from "react";
import { PlannerTask } from '@microsoft/microsoft-graph-types'
import { TeamsFxContext } from "../Context";
import { MonthYearStyles } from "../../Styles";

export default function Year(task: PlannerTask) {
  const {renderSettings} = useContext(TeamsFxContext);

  let dueDate: Date = new Date();
  let dueMonth: string = "";  
  let renderMonth: boolean = false;
    
  if (task.dueDateTime) {
    dueDate = new Date(task.dueDateTime);      

    if (renderSettings)
      if (renderSettings.currentMonth !== dueDate.getMonth()) {
          renderSettings.currentMonth = dueDate.getMonth();
          
          renderMonth = true;
      }

    dueMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][dueDate.getMonth()];    
  }

  return (
    <>
      {renderMonth && (
        <div className={MonthYearStyles.timelineStyle}>
          <header className={MonthYearStyles.timelineHeaderStyle}>
            <span className={MonthYearStyles.timelineMonthStyle}>{dueMonth}</span>            
          </header>
        </div>        
      )}
    </>
  )
}