import { 
  useContext, 
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { TeamsFxContext } from "../Context";
import { Client } from "@microsoft/microsoft-graph-client";
import { useGraphWithCredential } from "@microsoft/teamsfx-react";
import {
  Button, 
  Spinner,  
} from '@fluentui/react-components';
import { PlannerTask } from '@microsoft/microsoft-graph-types'
import { ITimeLineData } from "../../models"
import { 
  TimeLineService,  
  ITimeLineService,
} from "../../services";
import { 
  TimelineItem,
  CommandBar,
} from '..';
import {
  pagePaddingStyle,
  errorStyle,
  listedTaskStyle,  
  spinnerStyle,
  timelineHeaderStyle,
  timelineYearStyle,
  spinnerDiv,
  BucketNameStyle,
  CommandBarBlockStyle,
} from '../../Styles';

export default function Tab() {
  const { themeString, renderSettings, teamsUserCredential, configSettings, filterSettings, categorySettings, services } = useContext(TeamsFxContext);

  // scopes
  const scopes = ['User.Read.All', 'Tasks.Read', 'GroupMember.Read.All', 'Tasks.ReadWrite', 'TeamSettings.Read.All'];
  
  // states    
  const timeLineData = useRef<ITimeLineData | undefined>(undefined);
  const [plannerCategory, setPlannerCategory] = useState<{ [key: string]: string } | undefined>(undefined);

  const [needConsent, setNeedConsent] = useState(false);
  const [graphClient, setGraphClient] = useState<Client>();
  const [tasks, setTasks] = useState<PlannerTask[]>([]);

  const [retrievingTasks, setRetrievingTasks] = useState(true);
  const [bucketId, setBucketId] = useState<string>("");
  const [showActiveTasks, setShowActiveTasks] = useState(false);
  const [refreshData, setRefreshData] = useState(true);
  const [manualRefresh, setManualRefresh] = useState(false);
  
  // Callback sent into the CommandBar to handle the bucket change
  const bucketHandler = ({bucketId, bucketName}: {bucketId: string; bucketName: string}) => {
    // check if the filter settings are initialized
    if (filterSettings)
      // Set
      filterSettings.bucketId = bucketId;

    // Set to re-render the tasks
    setRefreshData(true);
    // Set the bucket id to re-render the tasks
    setBucketId(bucketId)    
  }

  // Callback sent into the CommandBar to handle the all tasks flag change
  const allTaskHandler = (allTasksFlag: boolean) => {
    // check if the filter settings are initialized
    if (filterSettings)
      // Set filter the show active tasks flag
      filterSettings.showActiveTasks = allTasksFlag;

    // Set to re-render the tasks
    setRefreshData(true);
    // Set the show active tasks flag
    setShowActiveTasks(allTasksFlag);
  }

  // Callback sent into the CommandBar to handle the task refresh
  const TaskRefreshHandler = (callbackFunction: any) => {
    // Set the retrieving tasks flag
    setRetrievingTasks(true);
    // Set the refresh data flag
    setRefreshData(true);
    // Set the manual refresh flag
    setManualRefresh(true);
    
    // Call the callback function to the CommandBar.
    callbackFunction();    
  }

  // Set the bucket id and show active tasks flag from the filter settings
  useEffect(() => {
    // Check if the filter settings are initialized
    if (filterSettings) {
      // Set the bucket id and show active tasks flag
      setBucketId(filterSettings.bucketId);
      // Set the show active tasks flag
      setShowActiveTasks(filterSettings.showActiveTasks);
    }    
  }, [filterSettings]);

  // Get the graph client
  const { loading, reload } = useGraphWithCredential(
    async (graph, teamsUserCredential, scope) => {      
      if (needConsent) {
        await teamsUserCredential.login(scopes);

        setNeedConsent(false);
      }
      try {
        // Get token to confirm the user is logged in
        await teamsUserCredential.getToken(scopes);
        
        setNeedConsent(false);        
      } catch (error: any) {        
        if (error.message.includes('Failed to get access token cache silently, please login first')) {
          // set needConsent to true
          setNeedConsent(true);
        }
      }

      // Set the graph client
      setGraphClient(graph);
    }, { scope: scopes, credential: teamsUserCredential }); 

  // Function to set the categories text from te plan settings
  function SetCategories(): void {
    if (plannerCategory && categorySettings) {
      // iterate through the categories
      for (let i = 1; i < 26; i++) {
        // Ggenerate the category key
        const categoryKey = `category${i}`;
        // Get the current category text
        let labelText = categorySettings[categoryKey].text;
        // only set if there is text label in plan settings
        categorySettings[categoryKey].text = plannerCategory[categoryKey] ? plannerCategory[categoryKey] : labelText;
      }     
    }
  }

  // Create a new timeline service
  const timelineService: ITimeLineService | undefined = useMemo((): ITimeLineService | undefined => {
    // check if the graph client and config settings initialized
    if (graphClient && configSettings) {
      // initialize the timeline service
      const timelineService = new TimeLineService(graphClient, configSettings);

      // Set to re-render the tasks
      setRefreshData(true);    

      if (services)
        services.timeLineService = timelineService;

      // Return the timeline service
      return timelineService;
    } else {
      // Return undefined if the graph client or config settings are not initialized
      return undefined;
    }
  }, [graphClient, configSettings]);
  
  // Set the bucket name
  const bucketName = useMemo((): string => {
    // Check if the bucket id is All
    if (bucketId === 'All') {
      // Set the bucket name
      return "In all buckets";
    } else {
      // Get the bucket name from buckets with the bucket id
      return renderSettings?.buckets.find((bucket) => bucket.id === bucketId)?.name || "Unknown Bucket";
    }
  }, [bucketId, renderSettings?.buckets]);
  
  // Refresh the tasks
  useEffect( () => {
    const fetchData = async () => {      
      // Check if the refresh data flag is set
      if (refreshData) {
        // Check if the timeline service and render settings are initialized
        if (timelineService && renderSettings) {
          // Check if require new data from graph
          if (retrievingTasks && (filterSettings?.refreshData || manualRefresh)) {            
            timeLineData.current = await timelineService.refreshTasks();    
          } else {
            timeLineData.current = await timelineService.getTimelineData();
          
            // Check if the group id is empty
            if (timeLineData.current.refresh) {
              timeLineData.current = await timelineService.refreshTasks();              
            }  
          }

          
          
          // Update the buckets and users data
          renderSettings.buckets = timelineService.getBuckets();
          renderSettings.users = timelineService.getTaskUsers();
        
          // Get the plan category descriptions
          setPlannerCategory(timelineService.getPlannerCategoryDescriptions());
          // update the category text settings
          SetCategories();
          
          setRefreshData(false);
          renderSettings.renderYear =false;
          renderSettings.currentYear = 0;
          renderSettings.renderMonth = true;
          renderSettings.currentMonth = -1;
          renderSettings.lastRenderedDate = new Date();

          // Check if the filter settings are initialized
          if (filterSettings) {
            // Get the filtered tasks
            setTasks(timelineService.getTasksForBucket(filterSettings));
          }
          
          // Set the retrieving tasks flag
          setRetrievingTasks(false);
        }
      }
    };
    
    fetchData(); 
  }, [refreshData, manualRefresh, timelineService, filterSettings, renderSettings, retrievingTasks, bucketId, showActiveTasks]);

  return (
    <div>
      { needConsent &&
        <div>
          <p>Authorize to grant permission to access Planner Tasks.</p>
          <Button appearance="primary" disabled={loading} onClick={reload} >
            Authorize
          </Button>          
        </div>
      }
      { graphClient && !needConsent &&
        <>
          <div>
            { retrievingTasks &&  
              <div className={spinnerDiv}>
                <Spinner className={spinnerStyle} labelPosition="below"  label="Retrieving Tasks..."/>
              </div>
            }
            { !retrievingTasks &&      
            <>
              <div className={CommandBarBlockStyle(themeString)}>
                <CommandBar onAllTask={allTaskHandler} onBucketId={bucketHandler} onTaskRefresh={TaskRefreshHandler} />
              </div>          
              <div className={pagePaddingStyle}>
                  { timeLineData.current?.error &&
                    <pre className={errorStyle}>Error: {timeLineData.current?.error}</pre>
                  }
                  <div>
                    <div className={BucketNameStyle}>
                      {bucketName}
                    </div>
                    {/* Bucket Name */}
                    <div className={listedTaskStyle}>
                      <span>{showActiveTasks ? "All Tasks" : "Active Tasks"}</span>                      
                    </div>
                    {/* Render the timeline */}
                    { tasks.map((task: PlannerTask) =>
                      <> 
                        <TimelineItem key={task.id} {...task}/>
                      </>
                    )}
                    <header className={timelineHeaderStyle}>
                      <span className={timelineYearStyle}>
                        { tasks.length > 0 ? "End" : tasks.length === 0 && "No Tasks" }
                      </span>
                    </header>                
                  </div>
                </div>
              </>
            }
          </div>
        </>
      }
    </div>
  );
}