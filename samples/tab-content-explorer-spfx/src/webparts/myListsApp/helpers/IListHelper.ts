import { ISPList }          from '../interfaces/ISPList';
import { IList }            from '../interfaces/IList';
import { ISPWeb}            from '../interfaces/ISPWeb';
import { ISPSite }          from '../interfaces/ISPSite';
import { 
  IHubSite, 
  IHubSiteResponseItem 
}                           from '../interfaces/IHubSites';
import { ISiteGroup }       from "../interfaces/ISiteGroup";
import { IDropdownOption }  from 'office-ui-fabric-react/lib/Dropdown';


export interface IListHelper {
  // Flat Layout Helper Methods
  prepareLists(siteUrl: string, lists: ISPList[], includeDocLibraries: boolean, includeSystemLibraries: boolean, openLinksInTeams: boolean): IList[];
  prepareSubSiteDropDown(siteUrl: string, subSites: ISPWeb[]): IDropdownOption[];
  prepareSubSiteUrl(siteUrl: string, relativeUrl: string): string;
  prepareHubSitesDropDown(path: string, hubSites: IHubSite[], hubSubSiteDropDown: boolean): IDropdownOption[];
  prepareHubSites(hubSiteId: string, sites: IHubSiteResponseItem[]): IHubSite[];
  // Grouped Layout Helper Methods
  prepareRootGroup(siteInfo: ISPSite): ISiteGroup;
  prepareGroupedHubSites(siteInfo: ISPSite, sites: IHubSiteResponseItem[], includeSubsites: boolean): ISiteGroup[];
  filterBatchedLists(batchedLists: ISPList[][], includeDocLibraries: boolean, includeSystemLibraries: boolean): ISPList[][];
  prepareNumberedGroupedHubs(groupedHubs: ISiteGroup[], batchedLists: ISPList[][]): ISiteGroup[];
  prepareGroupedLists(numberedGroupedHubs: ISiteGroup[], filteredBatchedLists: ISPList[][], openLinksInTeams: boolean): IList[];
  prepareGroupedSubSites(rootGroup: ISiteGroup, subsites: ISPWeb[]): ISiteGroup[];
}