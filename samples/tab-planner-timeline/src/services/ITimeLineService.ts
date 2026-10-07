import { 
  ITimeLineData,
  IFilterSettings
} from "../models";
import {  
  PlannerPlan,
  PlannerBucket, 
  PlannerTask,
  PlannerTaskDetails,
  User 
} from "@microsoft/microsoft-graph-types";

export interface ITimeLineService {
  // all inventory items
  getTimelineData(): Promise<ITimeLineData>;

  refreshTasks(): Promise<ITimeLineData>;

  getTimeLine(): ITimeLineData;

  getBuckets(): PlannerBucket[];

  getActiveTasks(sortBy: string): PlannerTask[];

  getPlannerCategoryDescriptions(): { [key: string]: string };

  getTasks(sortBy: string): PlannerTask[];

  getTaskDetails(taskId: string): Promise<PlannerTaskDetails | undefined>;

  getTaskUsers(): User[];

  getTasksForBucket(filterSettings: IFilterSettings): PlannerTask[];

  // New Advanced Service Methods    
  newPlannerPlan(title: string, groupId: string): Promise<PlannerPlan | undefined>;

  newPlannerBucket(planId: string, title: string, orderHint: string): Promise<PlannerBucket | undefined>

  newTask(planId: string, bucketId: string, title: string): Promise<PlannerTask | undefined>;

  // Delete Methods
  deletePlannerPlan(planId : string): Promise<void>;
}
