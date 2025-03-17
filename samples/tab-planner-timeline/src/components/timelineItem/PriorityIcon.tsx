import { 
  ArrowDown16Filled as LowIcon,
  Important16Filled as ImportantIcon,
  AlertUrgent16Filled as UrgentIcon,
  // Circle16Filled as MediumIcon,
  } from "@fluentui/react-icons";
  import { Tooltip  } from '@fluentui/react-components';
  import { 
    CalloutStyles,
    DatesAndDetailsStyles
  } from '../../Styles';

export default function PriorityIcon(props: { priority: number, forTimeline: boolean } ) {
  

  return (    
    <>
      {props.priority === 1 && (
        <div>
          { props.forTimeline ?
            <div className={DatesAndDetailsStyles.priorityTimelineStatusStyle}>
              <Tooltip content="Urgent Priority" relationship="label">
                <UrgentIcon className={CalloutStyles.urgentIconStyle}/>
              </Tooltip>        
            </div>
          :
            <>
              <div className={CalloutStyles.sectionTitleStyle}>Priority: </div>
              <div className={CalloutStyles.priorityStatusStyle}>              
                <UrgentIcon className={CalloutStyles.urgentIconStyle}/>
                Urgent
              </div>
            </>
          }
        </div>)}
      {props.priority === 3 && (
        <div>
          { props.forTimeline ?
            <div className={DatesAndDetailsStyles.priorityTimelineStatusStyle}>
              <Tooltip content="Important Priority" relationship="label">
                <ImportantIcon className={CalloutStyles.importantIconStyle}/>
              </Tooltip>        
            </div>
          :
            <>
              <div className={CalloutStyles.sectionTitleStyle}>Priority: </div>
              <div className={CalloutStyles.priorityStatusStyle}>              
                <ImportantIcon className={CalloutStyles.importantIconStyle}/>
                Important
              </div>
            </>
          }
        </div>)}
      {props.priority === 9 && (
        <div>
        { props.forTimeline ?
          <div className={DatesAndDetailsStyles.priorityTimelineStatusStyle}>
            <Tooltip content="Low Priority" relationship="label">
              <LowIcon className={CalloutStyles.lowIconStyle}/>
            </Tooltip>        
          </div>
        :
          <>
            <div className={CalloutStyles.sectionTitleStyle}>Priority: </div>
            <div className={CalloutStyles.priorityStatusStyle}>              
              <LowIcon className={CalloutStyles.lowIconStyle}/>
              Low
            </div>
          </>
        }
      </div>)}        
    </>
  )
}
