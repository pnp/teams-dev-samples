import { 
  ArrowDown16Filled as LowIcon,
  Important16Filled as ImportantIcon,
  AlertUrgent16Filled as UrgentIcon,
  // Circle16Filled as MediumIcon,
  } from "@fluentui/react-icons";
  import { Tooltip  } from '@fluentui/react-components';
  import {
  sectionTitleStyle,
  priorityStatusStyle,
  urgentIconStyle,
  lowIconStyle,
  importantIconStyle,
  priorityTimelineStatusStyle,
} from '../../Styles';

export default function PriorityIcon(props: { priority: number, forTimeline: boolean } ) {
  

  return (    
    <>
      {props.priority === 1 && (
        <div>
          { props.forTimeline ?
            <div className={priorityTimelineStatusStyle}>
              <Tooltip content="Urgent Priority" relationship="label">
                <UrgentIcon className={urgentIconStyle}/>
              </Tooltip>        
            </div>
          :
            <>
              <div className={sectionTitleStyle}>Priority: </div>
              <div className={priorityStatusStyle}>              
                <UrgentIcon className={urgentIconStyle}/>
                Urgent
              </div>
            </>
          }
        </div>)}
      {props.priority === 3 && (
        <div>
          { props.forTimeline ?
            <div className={priorityTimelineStatusStyle}>
              <Tooltip content="Important Priority" relationship="label">
                <ImportantIcon className={importantIconStyle}/>
              </Tooltip>        
            </div>
          :
            <>
              <div className={sectionTitleStyle}>Priority: </div>
              <div className={priorityStatusStyle}>              
                <ImportantIcon className={importantIconStyle}/>
                Important
              </div>
            </>
          }
        </div>)}
      {props.priority === 9 && (
        <div>
        { props.forTimeline ?
          <div className={priorityTimelineStatusStyle}>
            <Tooltip content="Low Priority" relationship="label">
              <LowIcon className={lowIconStyle}/>
            </Tooltip>        
          </div>
        :
          <>
            <div className={sectionTitleStyle}>Priority: </div>
            <div className={priorityStatusStyle}>              
              <LowIcon className={lowIconStyle}/>
              Low
            </div>
          </>
        }
      </div>)}        
    </>
  )
}
