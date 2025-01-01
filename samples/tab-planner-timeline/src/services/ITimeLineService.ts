import { 
  ITimeLineData,
  IFilterSettings
} from "../models";
import {  
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
}
