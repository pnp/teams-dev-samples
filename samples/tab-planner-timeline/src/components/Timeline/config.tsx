import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  Button, 
  Spinner,  
} from '@fluentui/react-components';
import{ v4 as uuidv4 } from 'uuid';
import * as microsoftTeams from "@microsoft/teams-js";
import { useTeams } from "@microsoft/teamsfx-react";
import { TeamsFxContext } from "../Context";
import { Client } from "@microsoft/microsoft-graph-client";
import { useGraphWithCredential } from "@microsoft/teamsfx-react";
import { PlannerBucket, PlannerPlan } from '@microsoft/microsoft-graph-types'
import {
  Tooltip,
  Checkbox,
  Dropdown,
  Option,
  useId,
} from '@fluentui/react-components';
import { activeTasksCheckboxStyle } from '../../Styles';

export default function Config() {
  const { themeString, configSettings, teamsUserCredential } = useContext(TeamsFxContext);
  const [{ context }] = useTeams();

  const scopes = ['User.Read.All', 'Tasks.Read', 'GroupMember.Read.All', 'Tasks.ReadWrite', 'TeamSettings.Read.All'];

  const planDropdownId = useId('planDropdown');
  const bucketDropdownId = useId('bucketDropdown');
  const [needConsent, setNeedConsent] = useState(false);
  const [graphClient, setGraphClient] = useState<Client>();
  const [planId, setPlanId] = useState<string>("All");
  const [plans, setPlans] = useState<PlannerPlan[]>([]);
  const [buckets, setBuckets] = useState<PlannerBucket[]>([]);
  const [bucketId, setBucketId] = useState<string>("");
  const [showActiveTasks, setShowActiveTasks] = useState(true);
  const planName = useRef<string>("");
  const bucketName = useRef<string>("");
  
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
  
  const uniqueId = generateShortUniqueId();
  const entityId = useRef(uniqueId);

  const onSaveHandler = (saveEvent: microsoftTeams.pages.config.SaveEvent) => {
    const baseUrl = `https://${window.location.hostname}:${window.location.port}/index.html#`;

    microsoftTeams.pages.config.setConfig({
      suggestedDisplayName: `${planName.current} Timeline`,
      entityId: entityId.current,
      contentUrl: `${baseUrl}/TimelineTab`,
    }).then(() => {      
      saveEvent.notifySuccess();
    });
  };

  useEffect(() => {
    if (context) {
      (async () => {
        microsoftTeams.pages.config.registerOnSaveHandler(onSaveHandler);
        microsoftTeams.pages.config.setValidityState(false);
      })();
    }
  }, [context]);

  useEffect(() => {
    if (planId) {
      entityId.current = JSON.stringify({ planId: planId, uniqueId: uniqueId, bucketId: bucketId === "" ? "All" : bucketId, showActiveTasks: showActiveTasks });
    }
  }, [planId, uniqueId, bucketId, showActiveTasks]);

  const bucketDropDownOptions = useMemo(() => {
    const options: JSX.Element[] = [];
    
    options.push(<Option key="All" value="All" text="All Buckets">All Buckets</Option>);

    buckets.forEach((bucket: PlannerBucket) => {      
      return options.push(<Option key={bucket.id} value={bucket.id} text={bucket.name ?? 'Unnamed Bucket'}>{bucket.name}</Option>);
    });
    
    return options;
  }, [buckets, planId]);

  const planDropDownOptions = useMemo(() => {
    const options: JSX.Element[] = [];

    // options.push(<Option key="new" value="new" text="Create New Plan">Create New Plan</Option>);
    
    plans.forEach((plan: PlannerPlan) => {
      return options.push(<Option key={plan.id} value={plan.id} text={plan.title ?? 'Unnamed Plan'}>{plan.title}</Option>);
    });

    return options;
  }, [plans]);

  const PlanSelect = useCallback((event: any, data: any) => {
      if (data) {
        // Set the bucket id from selection
        const planId = data.optionValue || "new"
          
        // Set the bucket name from selection
        const name = data.optionText || "";
        planName.current = name;      
        
        microsoftTeams.pages.config.setValidityState(true);
        setPlanId(planId);
      }
    }, []);

  const BucketSelect = useCallback((event: any, data: any) => {
      if (data) {
        // Set the bucket id from selection
        const bucketId = data.optionValue || "All"
        
        // Set the bucket name from selection
        bucketName.current = data.optionText || "";

        setBucketId(bucketId);
      }
    }, []);

    const AllTasksClick = useCallback(() => { 
      // Set the show active tasks flag
      setShowActiveTasks(!showActiveTasks);
      
    }, [showActiveTasks]);
    

  useEffect(() => {
    if (graphClient && configSettings) {
      graphClient.api(`/groups/${configSettings.groupId}/planner/plans`)
        .get()
        .then((response) => {
          setPlans(response.value);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [graphClient, configSettings]);

  useEffect(() => {
    if (graphClient && planId) {
      graphClient.api(`/planner/plans/${planId}/buckets`)
        .get()
        .then((response) => {
          setBuckets(response.value);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [graphClient, planId]);

  return (
    <>
      { needConsent ?
        <div>
          <p>Authorize to grant permission to access Planner Tasks.</p>
          <Button appearance="primary" disabled={loading} onClick={reload} >
            Authorize
          </Button>          
        </div>
      :      
        <div className={themeString === "default" ? "light" : themeString === "dark" ? "dark" : "contrast"}>
          <div className="config-container">
            <div className="config-header">
              <h2>Timeline Configuration</h2>
              <h3>Select Plan for Timeline</h3>
            </div>
            <div className="config-body">
              <div className="config-body-content">
                <Tooltip content="Plan for Timeline to Render" relationship="label">
                  <Dropdown placeholder='Select a Plan' 
                            aria-labelledby={planDropdownId}                                                        
                            onOptionSelect={PlanSelect} >                
                    { planDropDownOptions }              
                  </Dropdown>
                </Tooltip>                
              </div>
            </div>
            <div className="config-header">              
              <h3>Select Plan Bucket</h3>
            </div>
            <div className="config-body">
              <div className="config-body-content">
                <Tooltip content="Bucket for Timeline to Render" relationship="label">
                  <Dropdown placeholder='Select a Plan Bucket'
                            aria-labelledby={bucketDropdownId}
                            onOptionSelect={BucketSelect}
                            disabled={planId === ""} >
                    { bucketDropDownOptions }              
                  </Dropdown>
                </Tooltip>                
              </div>
            </div>
            <div className="config-header">              
              <h3>Filter</h3>
            </div>
            <div>
              <Checkbox label={showActiveTasks ? "Show all Tasks" : "Filter out completed Tasks"}
                        checked={showActiveTasks} 
                        className={activeTasksCheckboxStyle}
                        labelPosition="before"
                        disabled={planId === ""}
                        onChange={AllTasksClick} />            
            </div>
          </div>        
        </div>      
      }
    </>
  );
}

function generateShortUniqueId() {
    // Generate a full UUID
    const fullUuid = uuidv4();
    // Take the first 14 characters of the UUID
    return fullUuid.replace(/-/g, '').substring(0, 14);
}
