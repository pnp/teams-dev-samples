import { PlannerTask } from '@microsoft/microsoft-graph-types'
import { 
  TimelineYear,
  TimelineMonth,
  TimelineDetails
} from '..';
import { 
  timelineItemStyle,
  timelineContentStyle,  
} from '../../Styles';

export default function TimelineItem(task: PlannerTask) {  
  return (
      <>
        <TimelineYear {...task} />
        <div>
          <div className={timelineItemStyle}>
            <div className={timelineContentStyle}></div>
          </div>
          <TimelineMonth {...task} />
        </div>
        <TimelineDetails {...task} />        
      </>
    )
}
