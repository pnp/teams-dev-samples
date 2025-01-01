import { PlannerTask } from '@microsoft/microsoft-graph-types'
import { 
  Callout,
  DirectionalHint  
 } from "@fluentui/react";
 import { 
  useBoolean, 
  useId 
} from '@fluentui/react-hooks';
import moment from "moment";
import { Info24Filled as InfoIcon } from "@fluentui/react-icons";
import CalloutPane from './CalloutPane'; // Adjust the import path as necessary
import { 
  timelineRenderStyles,
  timelineItemStyle,
  timelineContentStyle,  
  taskItemTitleStyle,  
  calloutStyles,
  infoIconStyle,
  timelineTitleBlockStyle,
} from '../../Styles';
import {PriorityIcon } from '.';
import { useContext } from 'react';
import { TeamsFxContext } from '../Context';

export default function TimelineDetails(task: PlannerTask) {
  const { themeString } = useContext(TeamsFxContext);

  const aline: string = "right";
  
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);
  
  const buttonId = useId('callout-button');
  const labelId = useId('callout-label');
  const descriptionId = useId('callout-description');  

  function isOverDue(task: PlannerTask) {
    // if the task has a due date, get the due date
    if (task.dueDateTime)
      // check if the task is overdue by comparing the due date + 1 day to today's date
      return moment(new Date(task.dueDateTime)).add(1, 'd').isBefore(new Date());

    return false;
  }
  
  function dueDate(task: PlannerTask) {
    // if the task has a due date, get the due date
    if (task.dueDateTime)
      return "Due: " + moment(new Date(task.dueDateTime)).format("MMM D, YYYY");

    return "No due date";
  }

  function startDate(task: PlannerTask) {
    // if the task has a start date, get the start date
    if (task.startDateTime)
      return "Start: " + moment(new Date(task.startDateTime)).format("MMM D, YYYY");
    else 
      return "Start anytime";
  }
    
  function completedDate(task: PlannerTask) {
    if (task.completedDateTime)
      return "Completed: " + moment(new Date(task.completedDateTime)).format("MMM D, YYYY");

    return ""
  }

  const [timelineMarkerClass, gridClass] = timelineRenderStyles(themeString, task.percentComplete ?? 0, isOverDue(task));

  return (
      <>
        <div className={timelineItemStyle}>
          <div className={timelineMarkerClass.join(' ')}></div>
          <div className={timelineContentStyle}>
            <div className={gridClass.join(' ')} dir={aline === 'right' ? 'ltr' : 'rtl'}>
              <div className="ms-Grid-row">                
                  <div className="ms-Grid-col">
                    <span>{dueDate(task)}</span>
                  </div>
                  <div className="ms-Grid-col">
                    { task.completedDateTime ? 
                      <span>{completedDate(task)}</span> 
                    : 
                      <span>{startDate(task)}</span>                    
                    }
                  </div>
              </div> 
              <div className="ms-Grid-row">                
                <div className={timelineTitleBlockStyle}>
                  <div>
                    <InfoIcon
                      className={infoIconStyle}
                      id={buttonId}
                      onClick={toggleIsCalloutVisible}/>                    
                  </div>
                  <div className={taskItemTitleStyle}>
                    <PriorityIcon priority={task.priority ?? 0} forTimeline={true} />
                      {task.title}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isCalloutVisible ? (
            <Callout
              ariaLabelledBy={labelId}
              ariaDescribedBy={descriptionId}
              role="dialog"
              className={calloutStyles.callout}
              gapSpace={0}
              target={`#${buttonId}`}
              isBeakVisible={true}
              beakWidth={20}
              onDismiss={toggleIsCalloutVisible}
              directionalHint={DirectionalHint.bottomCenter}
              setInitialFocus>
              <CalloutPane {...task} />
            </Callout>) : null }          
        </div>
      </>
    )
}