import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { Button } from '@fluentui/react-components';
import { Field, Input } from "@fluentui/react-components";
import{ v4 as uuidv4 } from 'uuid';
import * as microsoftTeams from "@microsoft/teams-js";
import { useTeams } from "@microsoft/teamsfx-react";
import { TeamsFxContext } from "../Context";
import { Client } from "@microsoft/microsoft-graph-client";
import { useGraphWithCredential } from "@microsoft/teamsfx-react";
import { PlannerBucket, PlannerPlan } from '@microsoft/microsoft-graph-types'
import { Scopes as scopes } from '../../models';
import {
  Tooltip,  
  Switch,
  Dropdown,
  Option,
  useId,
} from '@fluentui/react-components';
import { 
  CommandBarStyles,
  ConfigStyles
} from '../../Styles';

export default function Config() {
  const { themeString, configSettings, teamsUserCredential } = useContext(TeamsFxContext);
  const [{ context }] = useTeams();

  const planDropdownId = useId('planDropdown');
  const bucketDropdownId = useId('bucketDropdown');
  const [needConsent, setNeedConsent] = useState(false);
  const [graphClient, setGraphClient] = useState<Client>();
  const [planId, setPlanId] = useState<string>("");
  const [plans, setPlans] = useState<PlannerPlan[]>([]);
  const [buckets, setBuckets] = useState<PlannerBucket[]>([]);
  const [bucketId, setBucketId] = useState<string>("All");
  const [showActiveTasks, setShowActiveTasks] = useState(false);
  const [showAddNewPlan, setShowAddNewPlan] = useState(false);
  const [newPlanName, setNewPlanName] = useState<string>("");
  const [newBucketName, setNewBucketName] = useState<string>("To Do");
  const [enableAddNewSwitch, setEnableAddNewSwitch] = useState(true);
  const [addPlan, setAddPlan] = useState(false);
  const [enableAddNewPlanButton, setEnableAddNewPlanButton] = useState(false);
  const [reloadPlans, setReloadPlans] = useState(false);
  const planName = useRef<string>("");
  const bucketName = useRef<string>("All Buckets");
  
  // Get the graph client
  const { loading, reload } = useGraphWithCredential(
    async (graph, teamsUserCredential, scope) => {      
      let setGraph = false;
      try {
        if (needConsent) {
          await teamsUserCredential.login(scopes);

          setNeedConsent(false);
        }
      
        // Get token to confirm the user is logged in
        await teamsUserCredential.getToken(scopes);
        
        setGraph = true;
        setNeedConsent(false);        
      } catch (error: any) {        
        if (error.message.includes('Failed to get access token cache silently, please login first')) {
          // set needConsent to true
          setNeedConsent(true);
        }
      }

      // Set the graph client
      if (setGraph)
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
  }, [buckets]);

  const planDropDownOptions = useMemo(() => {
    const options: JSX.Element[] = [];

    plans.forEach((plan: PlannerPlan) => {
      return options.push(<Option key={plan.id} value={plan.id} text={plan.title ?? 'Unnamed Plan'}>{plan.title}</Option>);
    });

    if (options.length === 0) {
      setShowAddNewPlan(true);
      setEnableAddNewSwitch(false);
    } else {
      setShowAddNewPlan(false);
      setEnableAddNewSwitch(true);
    }

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
  
  const AddNewPlanClick = useCallback(() => { 
    // Set the add new plan flag
    setShowAddNewPlan(!showAddNewPlan);
    if (showAddNewPlan) {
      setPlanId("");
      setBuckets([]);
      bucketName.current = "All Buckets";
      setBucketId("All");
    } else {
      microsoftTeams.pages.config.setValidityState(false);
    }
      
  }, [showAddNewPlan]); 

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
  }, [graphClient, configSettings, reloadPlans]);
  
  useEffect(() => {
    if (graphClient && addPlan) {
      // Add a new plan
      const newPlan = {
        owner: configSettings.groupId,
        title: newPlanName,
      };
      
      graphClient
        .api("/planner/plans")
        .post(newPlan)
        .then((response) => {
          // Add new bucket to Plan
          const newBucket = {
            name: newBucketName,
            planId: response.id,
          };
          
          graphClient
            .api("/planner/buckets")
            .post(newBucket)
            .then((response) => {
              setAddPlan(false);
              setShowAddNewPlan(false);
              setNewPlanName("");
              setEnableAddNewPlanButton(false);
              setNewBucketName("To Do");
              setBuckets([]);
              bucketName.current = "All Buckets";
              setReloadPlans(true);
            })
            .catch((error) => {
              console.error(error);
            }
          );              
        })
        .catch((error) => {
          console.error(error);
        }
      );      
    }
  }, [graphClient, addPlan, configSettings.groupId, newPlanName, newBucketName]);

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

  const newPlanNameChange = useCallback((event: any, data: any) => {
    if (data) {
      setNewPlanName(data.value);
      setEnableAddNewPlanButton(data.value !== "" && newBucketName !== "");
    }
  }, [newBucketName]);

  const newBucketNameChange = useCallback((event: any, data: any) => {
    if (data) {
      setNewBucketName(data.value);
      setEnableAddNewPlanButton(data.value !== "" && newPlanName !== "");
    }
  }, [newPlanName]);

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
          <div className="config-header">
            <div className={ConfigStyles.configHeading}>Timeline Configuration</div>

            <div className="config-header">
              <div className={ConfigStyles.configDropdownLabel}>Existing or New Plan</div>
            </div>
            <Switch
              label={showAddNewPlan ? "Create New Plan" : "Existing Plan"}
              className={CommandBarStyles.addPlanSwitchStyle}
              labelPosition="after"
              disabled={!enableAddNewSwitch}
              onChange={AddNewPlanClick} />
          </div>
          { showAddNewPlan ?
            <>              
              <div className="config-body">
                <Field label="Plan Title" required size="medium">
                  <Input 
                    onChange={newPlanNameChange} 
                    value={newPlanName}/>
                </Field>
              </div>              
              <div className="config-body">
                <Field label="Bucket Title" required size="medium">                
                  <Input 
                    onChange={newBucketNameChange} 
                    value={newBucketName} />
                </Field>
              </div>
              <div>
                <button 
                  className={ConfigStyles.addNewPlanButton} 
                  disabled={!enableAddNewPlanButton}
                  onClick={() => setAddPlan(true)} >
                  Create Plan
                </button>
              </div>
            </>
          :
            <>
              <div className={ConfigStyles.configDropdownLabel}>Select Plan for Timeline</div>
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
                <div className={ConfigStyles.configDropdownLabel}>Select Plan Bucket</div>
              </div>
              <div className="config-body">
                <div className="config-body-content">
                  <Tooltip content="Bucket for Timeline to Render" relationship="label">
                    <Dropdown placeholder={bucketName.current}
                              aria-labelledby={bucketDropdownId}
                              selectedOptions={[bucketId]}
                              onOptionSelect={BucketSelect}
                              disabled={planId === ""} >
                      { planId === "" ? [] : bucketDropDownOptions }              
                    </Dropdown>
                  </Tooltip>                
                </div>
              </div>
            </>
          }
            <div className={ConfigStyles.configFilterLabel}>Filter</div>
            <div className="config-header">
              <div className={ConfigStyles.configDropdownLabel}>Show All or Active Tasks</div>
            </div>
            <div>              
              <Switch 
                label={showActiveTasks ? "All Tasks" : "Only Active Tasks"}
                checked={showActiveTasks} 
                className={CommandBarStyles.activeTasksSwitchStyle}
                labelPosition="after"
                disabled={planId === ""}
                onChange={AllTasksClick} />
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
