import { 
  IFilterSettings,
  ITimeLineData,
  IConfigSettings,
} from '../models';
import { ITimeLineService } from '.';
import { Client } from "@microsoft/microsoft-graph-client";
import { 
  PlannerPlan,
  PlannerPlanDetails,
  PlannerTaskDetails,
  PlannerBucket,
  PlannerTask,
  User,
} from '@microsoft/microsoft-graph-types'

interface PlannerPlanDel extends PlannerPlan {
  "@odata.etag": string;
}

export class TimeLineService implements ITimeLineService {
  // Private members
  private _graphClient: Client;
  private _pageId = "";
  private _buckets: PlannerBucket[] = [];
  private _taskUsers: User[] = [];
  private _tasks: PlannerTask[] = [];
  private _planDetails: PlannerPlanDetails | undefined = undefined;
  private _cacheData: boolean = false;

  private _timeLine: ITimeLineData = {
    groupId: "",
    planId: "",
    refresh: true,
  };

  // Constructor
  constructor(graphClient: Client, configSettings: IConfigSettings) {
    this._graphClient = graphClient;
    this._timeLine.groupId = configSettings.groupId;
    this._timeLine.planId = configSettings.planId;
    this._pageId = configSettings.pageId;
    this._cacheData = "#web#desktop#".includes('#' + configSettings.clientType + '#');
  }

  public async getTimelineData(): Promise<ITimeLineData> {
    // Check session timeline data, return true if no cashed data
    this._timeLine.refresh =  await this._getTimelineData();;
    
    return this._timeLine;
  }

  public async refreshTasks(): Promise<ITimeLineData> {
    this._timeLine.refresh = false;

    try {
      // Get all users
      const allUsers = await this._graphClient
        .api("/groups/" + this._timeLine.groupId + "/members")
        .select("id,displayName,mail")
        .get();

      // Set all users
      this._taskUsers = allUsers.value;

      if (this._timeLine.planId) {        
        // Get Plan Details
        const planDetails = await this._graphClient
          .api("/planner/plans/" + this._timeLine.planId + "/details")
          .get();

        this._planDetails = planDetails;

        // Get all buckets        
        const bucketsData = await await this._graphClient
          .api("/planner/plans/" + this._timeLine.planId + "/buckets")
          .get();

        // Set buckets
        this._buckets = bucketsData.value.sort((a: PlannerBucket, b: PlannerBucket) => (a.name ?? "").localeCompare(b.name ?? ""));

        // Get all tasks        
        if (this._timeLine.planId) {
          const tasksData = await this._graphClient
            .api("/planner/plans/" + this._timeLine.planId + "/Tasks")
            .orderby("dueDateTime")
            .get();

          // Set tasks
          const tasks: PlannerTask[] = tasksData.value;

          // Get task details
          this._tasks = await this._getTaskDetails(tasks);
        }
      }
    } catch (error: unknown) {
      // Set error message
      this._timeLine.error = (error as Error)?.message;
    }

    // Save timeline data to session storage
    this._saveTimelineData(
      this._timeLine,
      this._buckets,
      this._taskUsers,
      this._tasks,
      this._planDetails
    );

    // Return timeline data
    return this._timeLine;
  }

  private async _getTaskDetails(tasks: PlannerTask[]): Promise<PlannerTask[]> {
    for (const task of tasks) {
      if (task.completedBy) {
        const user = this._taskUsers.find(
          (u) => u.id === task.completedBy?.user?.id
        );
        if (user) {
          if (task.completedBy.user) {
            task.completedBy.user.displayName = user.displayName;
          }
        }
      }

      if (task.createdBy) {
        const user = this._taskUsers.find(
          (u) => u.id === task.createdBy?.user?.id
        );
        if (user) {
          if (task.createdBy.user) {
            task.createdBy.user.displayName = user.displayName;
          }
        }
      }

      if (task.bucketId) {
        const bucket = this._buckets.find((b) => b.id === task.bucketId);
        if (bucket) {
          task.bucketId = bucket.id + ":" + bucket.name;
        }
      }
    }

    return tasks;
  }

  // Get timeline data
  public getTimeLine(): ITimeLineData {
    return this._timeLine;
  }

  // Get Planner buckets
  public getBuckets(): PlannerBucket[] {
    return this._buckets;
  }

  // Get tenant users
  public getTaskUsers(): User[] {
    return this._taskUsers;
  }

  public getPlannerCategoryDescriptions(): { [key: string]: string } {
    return this._planDetails?.categoryDescriptions as { [key: string]: string } ?? {};
  }
  
    
  public async getTaskDetails(taskId: string): Promise<PlannerTaskDetails | undefined> {
    let taskDetails: PlannerTaskDetails | undefined = undefined;
    try {
      const detail = await this._graphClient
        .api("/planner/tasks/" + taskId + "/details")
          .get();

        taskDetails = detail;

    } catch (error: unknown) {
      // Set error message
      this._timeLine.error = (error as Error)?.message;
    }

    return taskDetails;
  }

  // Get Planner tasks
  public getTasks(sortBy: string): PlannerTask[] {
    const tasksWithDate: PlannerTask[] = [];
    const tasksNoDate: PlannerTask[] = [];

    if (sortBy.toLowerCase() === "duedate") {
      this._tasks.forEach((task) => {
        if (task.dueDateTime) {
          tasksWithDate.push(task);
        } else {
          tasksNoDate.push(task);
        }
      });

      return tasksWithDate.length > 0 ? tasksNoDate.concat(this._sortTasksByDueDate(tasksWithDate)) : tasksNoDate;
    } else if (sortBy.toLowerCase() === "stratdate") {
      this._tasks.forEach((task) => {
        if (task.startDateTime) {
          tasksWithDate.push(task);
        } else {
          tasksNoDate.push(task);
        }
      });
      
      return tasksWithDate.length > 0 ? tasksNoDate.concat(this._sortTasksByStartDate(tasksWithDate)) : tasksNoDate;      
    } else {
      return this._tasks;
    }
  }

  // Get active tasks
  public getActiveTasks(sortBy: string): PlannerTask[] {
    const orderedTasks = this.getTasks(sortBy);

    return orderedTasks.filter((task) => {
      return !task.completedDateTime;
    });
  }

  // Get tasks sort by start date
  private _sortTasksByStartDate(tasks: PlannerTask[]): PlannerTask[] {
    tasks = tasks.sort((a, b) => {
      if (a.startDateTime && b.startDateTime) {
        return a.startDateTime.localeCompare(b.startDateTime);
      } else {
        return 0;
      }
    });

    return tasks;
  }

  // get tasks sort by due date
  private _sortTasksByDueDate(tasks: PlannerTask[]): PlannerTask[] {
    tasks = tasks.sort((a, b) => {
      if (a.dueDateTime && b.dueDateTime) {
        return a.dueDateTime.localeCompare(b.dueDateTime);
      } else {
        return 0;
      }
    });

    return tasks;
  }

  public getTasksForBucket(filterSettings: IFilterSettings): PlannerTask[] {
    let tasks: PlannerTask[] = [];

    if (filterSettings.showActiveTasks) {
      tasks = this.getTasks("dueDate");
    } else {
      tasks = this.getActiveTasks("dueDate");
    }

    if (filterSettings.bucketId !== "All" && filterSettings.bucketId !== "") {
      const filteredTasks: PlannerTask[] = [];

      tasks.forEach((task) => {
        if (
          task.bucketId &&
          task.bucketId.startsWith(filterSettings.bucketId)
        ) {
          filteredTasks.push(task);
        }
      });

      return filteredTasks;
    }

    return tasks;
  }

  // Get timeline data from session storage
  private async _getTimelineData(): Promise<boolean> {
    if (!this._cacheData) {
      return true;
    }

    const timelineData = sessionStorage.getItem("_" + this._pageId + "TimelineData");

    if (timelineData) {
      const buckets = sessionStorage.getItem("_" + this._pageId + "buckets");
      const Users = sessionStorage.getItem("_" + this._pageId + "Users");
      const tasks = sessionStorage.getItem("_" + this._pageId + "tasks");
      const planDetails = sessionStorage.getItem("_" + this._pageId + "planDetails");
      
      this._timeLine = JSON.parse(timelineData) as ITimeLineData;
      this._buckets = buckets ? (JSON.parse(buckets) as PlannerBucket[]) : [];
      this._taskUsers = Users ? (JSON.parse(Users) as User[]) : [];
      this._tasks = tasks ? (JSON.parse(tasks) as PlannerTask[]) : [];
      this._planDetails = planDetails ? (JSON.parse(planDetails) as PlannerPlanDetails) : undefined;

      return false;
    } else {
      return true;
    }
  }

  // Save timeline data to session storage
  private async _saveTimelineData(
    timelineData: ITimeLineData,
    buckets: PlannerBucket[],
    Users: User[],
    tasks: PlannerTask[],
    planDetails: PlannerPlanDetails | undefined
  ) {
    if (this._cacheData) {
      sessionStorage.setItem("_" + this._pageId + "TimelineData", JSON.stringify(timelineData));
      sessionStorage.setItem("_" + this._pageId + "buckets", JSON.stringify(buckets));
      sessionStorage.setItem("_" + this._pageId + "Users", JSON.stringify(Users));
      sessionStorage.setItem("_" + this._pageId + "tasks", JSON.stringify(tasks));
      sessionStorage.setItem("_" + this._pageId + "planDetails", JSON.stringify(planDetails));
    }
  }

   // Advanced Service Methods
   // Add new Planner Plan
   public async newPlannerPlan(title: string, groupId: string): Promise<PlannerPlan | undefined> {
    // initialize plan to be returned
    let plan: PlannerPlan | undefined = undefined;

    try {
      // create new plan object
      const newPlan = {
        owner: groupId,
        title: title,
      };

      // create new plan
      plan = await this._graphClient
        .api("/planner/plans")
        .post(newPlan);
      
    } catch (error: unknown) {
      console.error(error);
    }

    // return new plan
    return plan;
  }
  
  // Add new Bucket to existing Plan
  public async newPlannerBucket(planId: string, title: string, orderHint: string = " !"): Promise<PlannerBucket | undefined> {
    // initialize bucket to be returned
    let bucket: PlannerBucket | undefined = undefined;

    try {
      // create new bucket object
      const newBucket = {
        name: title,
        planId: planId,
        orderHint: orderHint,
      };

      // create new bucket
      bucket = await this._graphClient
        .api("/planner/buckets")
        .post(newBucket);
      
    } catch (error: unknown) {
      console.error(error);
    }

    // return new bucket
    return bucket;
  }
  
  // Add new Task to existing Plan Bucket
  public async newTask(planId: string, bucketId: string, title: string): Promise<PlannerTask | undefined> {
    // initialize task to be returned
    let task: PlannerTask | undefined = undefined;
    
    try {
      // create new task object
      const newTask = {
        planId: planId,
        bucketId: bucketId,
        title: title,
        assignments: {}
      };

      // create new task
      task = await this._graphClient
        .api("/planner/tasks")
        .post(newTask);
      
    } catch (error: unknown) {
      console.error(error);
    }

    // return new task
    return task; 
  }

  // Delete Exiting Planner Plan
  public async deletePlannerPlan(planId : string): Promise<void> {
    // get plan @odata.etag
    // NOTE: PlannerPlanDel extends PlannerPlan with @odata.etag
    const plan: PlannerPlanDel | undefined = await this._getPlannerPlans(planId);
    
    if (plan) {
      try {
        // delete plan using planId and @odata.etag
        await this._graphClient
          .api("/planner/plans/" + plan.id)
          .header("If-Match", plan["@odata.etag"])
          .delete();
      } catch (error: unknown) {
        console.error(error);
      }
    }
  }
  
  // Private Methods to get Planner Plans by PlanId
  private async _getPlannerPlans(planId: string): Promise<PlannerPlanDel | undefined> {
    // initialize plan to be returned 
    // NOTE: PlannerPlanDel extends PlannerPlan with @odata.etag
    let plan: PlannerPlanDel | undefined = undefined;

    try {
      // get plan by planId
      plan = await this._graphClient
        .api("/planner/plans/" + planId)
        .select("id, title")
        .get();
    } catch (error: unknown) {
      console.error(error);
    }

    // return plan with @odata.etag
    return plan;
  }
}