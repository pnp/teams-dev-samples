import { useContext } from "react";
import { PlannerTask } from '@microsoft/microsoft-graph-types'
import { TeamsFxContext } from "../Context";
import moment from "moment";
import {
  timelineStyle,
  timelineHeaderStyle,
  timelineYearStyle
} from "../../Styles";

export default function Year(task: PlannerTask) {
  const {renderSettings} = useContext(TeamsFxContext);

  let renderYear: boolean = true;
  let dueDate: Date = new Date();
    
  if (task.dueDateTime) {
    dueDate = new Date(task.dueDateTime);
    if (renderSettings) {
      const dateDiff: number = moment(dueDate).diff(renderSettings.lastRenderedDate, 'seconds');

      // Set the last rendered due date
      renderSettings.lastRenderedDate = dueDate;

      if (dateDiff < 0)
        renderYear = true;
      
      renderYear = renderSettings.renderYear

      if (!renderYear) {
        if (renderSettings.currentYear === 0) {      
          renderYear = true;
          renderSettings.currentYear = dueDate.getFullYear() || 0;
        } else {
          if (renderSettings.currentYear === dueDate.getFullYear()) {
            renderYear = false;
          } else {
            renderYear = true;
            
            if (renderSettings) {
              renderSettings.currentYear = dueDate.getFullYear() || 0;
              renderSettings.currentMonth = -1;
              renderSettings.renderMonth = true;
            }
          }    
        }
      }
    }
  }
  
  return (
    <>
      {renderYear && (
        <div className={timelineStyle}>
          <header className={timelineHeaderStyle}>
            <span className={timelineYearStyle}>{dueDate?.getFullYear()}</span>
          </header>
        </div>        
      )}
    </>
  )
}
