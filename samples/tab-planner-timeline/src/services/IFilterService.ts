import { 
    IFilterSettings
  } from "../models";
  
export interface IFilterService {
  saveFilterSettings(pageId: string, filterSettings: IFilterSettings): void;

  getFilterSettings(pageId: string): IFilterSettings;
}