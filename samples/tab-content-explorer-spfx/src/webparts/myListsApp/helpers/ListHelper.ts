import { IListHelper }      from './IListHelper';
import { ISPList }          from '../interfaces/ISPList';
import { IList }            from '../interfaces/IList';
import { 
  ISPWeb
}                           from '../interfaces/ISPWeb';
import { 
  IHubSite, 
  IHubSiteResponseItem 
}                           from "../interfaces/IHubSites";
import { ISiteGroup }       from "../interfaces/ISiteGroup";
import { Constants }        from '../constants/Constants';
import { ISPSite }          from '../interfaces/ISPSite';
import { IDropdownOption }  from 'office-ui-fabric-react/lib/Dropdown';


export class ListHelper implements IListHelper {
  
  
  /*************************************************************************************
  * Prepares SP Lists for UI
  *
  * @public
  * @param {string} siteUrl
  * @param {ISPList[]} lists
  * @param {boolean} includeDocLibraries
  * @param {boolean} includeSystemLibraries
  * @param {boolean} openLinksInTeams
  * @memberof ListHelper
  *************************************************************************************/
  public prepareLists(siteUrl: string, lists: ISPList[], includeDocLibraries: boolean, includeSystemLibraries: boolean, openLinksInTeams: boolean): IList[] {
    let formattedLists: IList[] = [];
    let target: string;

    // Case: When System Libraries are included and Doc Libs are excluded, filter out Doc Libs
    // TODO: refactor to private function to avoid redundancy in if-else statements below
    if (includeSystemLibraries && !includeDocLibraries) {
      lists.forEach((list: ISPList) => {
        // When not a Doc Lib, skip to next list
        if (
          list.BaseTemplate === 101 &&
          list.ListItemEntityTypeFullName !== 'SP.Data.FormServerTemplatesItem' &&
          list.ListItemEntityTypeFullName !== 'SP.Data.SiteAssetsItem' &&
          list.ListItemEntityTypeFullName !== 'SP.Data.Style_x0020_LibraryItem'
          ) {
          return;
        }

        let listType: string;
        let modified: string;
        let tenantUrl: string;
        let dateObj: Date = new Date(list.LastItemModifiedDate);
        // Set Tenant Url
        if (list.ParentWebUrl.toLowerCase() === '/') {
          tenantUrl = siteUrl;
        } else {
          tenantUrl = siteUrl.toLowerCase().replace(list.ParentWebUrl.toLowerCase(), '');
        }
        // Set List Url
        const listUrl: string = tenantUrl + list.RootFolder.ServerRelativeUrl.toLowerCase();
        // Set List Type
        for (var i = 0; i < Constants.LISTTYPE.length; i++) {
          if (list.BaseTemplate === Constants.LISTTYPE[i].key) {
            listType = Constants.LISTTYPE[i].text;
          }
        }
        // Set whether to open in teams or in new browser tab
        target = openLinksInTeams && list.BaseTemplate !== 106 ? '_self' : '_blank';
        // Construct date string for UI
        modified = `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
  
        const formattedListItem: IList = {
          type: listType,
          id: list.Id,
          iconUrl: list.ImageUrl,
          items: list.ItemCount,
          modified: modified,
          name: list.Title,
          url: listUrl,
          target: target
        };

        formattedLists.push(formattedListItem);
      });
    } 
    else {
      formattedLists = lists.map((list: ISPList): IList => {
        let listType: string;
        let modified: string;
        let tenantUrl: string;
        let dateObj: Date = new Date(list.LastItemModifiedDate);
        // Set Tenant Url
        if (list.ParentWebUrl.toLowerCase() === '/') {
          tenantUrl = siteUrl;
        } else {
          tenantUrl = siteUrl.toLowerCase().replace(list.ParentWebUrl.toLowerCase(), '');
        }
        // Set List Url
        const listUrl: string = tenantUrl + list.RootFolder.ServerRelativeUrl.toLowerCase();
        // Set List Type
        for (var i = 0; i < Constants.LISTTYPE.length; i++) {
          if (list.BaseTemplate === Constants.LISTTYPE[i].key) {
            listType = Constants.LISTTYPE[i].text;
          }
        }
        // Set whether to open in teams or in new browser tab
        target = openLinksInTeams && list.BaseTemplate !== 106 ? '_self' : '_blank';
        // Construct date string for UI
        modified = `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
  
        return {
          type: listType,
          id: list.Id,
          iconUrl: list.ImageUrl,
          items: list.ItemCount,
          modified: modified,
          name: list.Title,
          url: listUrl,
          target: target
        };
      });
    }

    return formattedLists;
  }


  /*************************************************************************************
  * Prepares SP Subsites for Dropdown Component
  *
  * @public
  * @param {string} siteUrl
  * @param {ISPWeb[]} subSites
  * @memberof ListHelper
  *************************************************************************************/
  public prepareSubSiteDropDown(siteUrl: string, subSites: ISPWeb[]): IDropdownOption[] {
    let subSitesDropDownOptions: IDropdownOption[] = [];

    if (!subSites.length) {
      return subSitesDropDownOptions;
    }
    // Set Root Site dropdown option
    const rootSiteOption: IDropdownOption = {
      key: siteUrl,
      text: "/"
    };

    subSitesDropDownOptions = subSites.map((subSite) => {
      const text: string = subSite.ServerRelativeUrl.split('/').pop();
      subSite.Url = `${siteUrl}/${text}`;

      const dropDownOption: IDropdownOption = {
        key: subSite.Url,
        text: `/${text}`
      };

      return dropDownOption;
    });

    // Add Root Site to dropdown options
    subSitesDropDownOptions.unshift(rootSiteOption);

    return subSitesDropDownOptions;
  }


  /*************************************************************************************
  * Prepares URL of Subsite
  *
  * @public
  * @param {string} siteUrl
  * @param {string} relativeUrl
  * @memberof ListHelper
  *************************************************************************************/
  public prepareSubSiteUrl(siteUrl: string, relativeUrl: string): string {
    let subSiteUrl: string;
    let subSiteName: string = relativeUrl.split('/').pop();

    subSiteUrl = `${siteUrl}/${subSiteName}`;

    return subSiteUrl;
  }


  /*************************************************************************************
  * Prepares Hub Sites Dropdown Component
  *
  * @public
  * @param {string} path
  * @param {IHubSite[]} hubSites
  * @param {boolean} hubSubSiteDropDown
  * @memberof ListHelper
  *************************************************************************************/
  public prepareHubSitesDropDown(path: string, hubSites: IHubSite[], hubSubSiteDropDown: boolean): IDropdownOption[] {
    let hubSitesDropDownOptions: IDropdownOption[] = [];

    if (!hubSites.length) {
      return hubSitesDropDownOptions;
    }

    hubSitesDropDownOptions = hubSites.map((hubSite: IHubSite): IDropdownOption  => {
      let pathTitle: string;

      if (hubSubSiteDropDown) {
        pathTitle = hubSite.path.substr(path.length);
      } else {
        pathTitle = hubSite.title;
      }

      let dropDownOption: IDropdownOption = {
        key: hubSite.path,
        text: pathTitle
      };

      return dropDownOption;
    });

    // If Hub Site dropdown is enabled, add Root Site to dropdown options
    if (hubSubSiteDropDown) {
      const rootOption: IDropdownOption = {
        key: path,
        text: "/"
      };
  
      hubSitesDropDownOptions.unshift(rootOption);
    }

    return hubSitesDropDownOptions;
  }


  /*************************************************************************************
  * Prepares Hub Sites
  *
  * @public
  * @param {string} hubSiteId
  * @param {IHubSiteResponseItem[]} sites
  * @memberof ListHelper
  *************************************************************************************/
  public prepareHubSites(hubSiteId: string, sites: IHubSiteResponseItem[]): IHubSite[] {
    let hubSite: IHubSite = null;
    let subSites: IHubSite[] = [];    
    let childHubSites: IHubSite[] = [];
    let hubSites: IHubSite[] = [];

    sites.forEach((site) => {
      const preparedHubSite: IHubSite = {
        title: site.Title,
        path: site.Url,
        siteId: site.ItemReference.SiteId,
        webId: site.ItemReference.WebId
      };

      // Check whether site is Hub Site, associated Hub Site, or a Subsite
      if (hubSiteId === site.ItemReference.SiteId && site.WebTemplate === 'SITEPAGEPUBLISHING') {
        hubSite = preparedHubSite;
      } else if (site.WebTemplate === 'GROUP' || site.WebTemplate === 'SITEPAGEPUBLISHING') {
        childHubSites.push(preparedHubSite);
      } else {
        subSites.push(preparedHubSite);
      }
    });

    if (!hubSite) {
      return hubSites;
    }

    // Set Hub Sites array as follows: Hub Site followed by all associated Hub Sites
    hubSites = [].concat(childHubSites);
    hubSites.unshift(hubSite);

    if (subSites.length) {
      if (!hubSites.length) {
        return hubSites;
      }
      // Set Subsites with corresponding parent site
      // N.B. Associated = Site Collections (Team or Communication Sites)
      subSites.forEach((subSite) => {
        for(let i = 0; i < hubSites.length; i++) {
          if (hubSites[i].siteId === subSite.siteId) {
            if (!hubSites[i].subSites) {
              hubSites[i].subSites = [];
            }
            hubSites[i].subSites.push(subSite);
            break;
          }
        }
      });
    }

    return hubSites;
  }


  /*************************************************************************************
  * Prepares Hub Sites and Associated Hub Sites for Grouped view
  *
  * @public
  * @param {ISPSite} siteInfo
  * @param {IHubSiteResponseItem[]} sites
  * @param {boolean} includeSubsites
  * @memberof ListHelper
  *************************************************************************************/
  public prepareGroupedHubSites(siteInfo: ISPSite, sites: IHubSiteResponseItem[], includeSubsites: boolean): ISiteGroup[] {
    let hubSite: ISiteGroup = null;
    let subSites: ISiteGroup[] = [];    
    let childHubSites: ISiteGroup[] = [];
    let groupedHubs: ISiteGroup[] = [];

    sites.forEach((site: IHubSiteResponseItem): void => {
      const preparedGroup: ISiteGroup = {
        key: site.Url,
        name: null,
        startIndex: 0,
        count: 0,
        level: 0,
        title: site.Title,
        siteId: site.ItemReference.SiteId
      };

      // Check whether site is Hub Site, associated Hub Site, or a Subsite
      if (siteInfo.HubSiteId === site.ItemReference.SiteId && site.WebTemplate === 'SITEPAGEPUBLISHING') {
        hubSite = preparedGroup;
        hubSite.name = hubSite.title;
      } else if (site.WebTemplate === 'GROUP') {
        preparedGroup.name = `${siteInfo.RootWeb.Title} > ${preparedGroup.title}`;

        childHubSites.push(preparedGroup);
      } else if (site.WebTemplate === 'SITEPAGEPUBLISHING') {
        preparedGroup.name = `${siteInfo.RootWeb.Title} > ${preparedGroup.title}`;

        childHubSites.push(preparedGroup);
      } else {
        subSites.push(preparedGroup);
      }
    });

    // Check if Hub Site was filled, if not return empty array
    if (!hubSite) {
      return groupedHubs;
    }

    // Set Hub Sites array as follows: hub Site followed by all Asssociated Sites
    groupedHubs = [].concat(childHubSites);
    groupedHubs.unshift(hubSite);

    // Check whether Subsites are not required or if there are no Subsites
    if (!includeSubsites || !subSites.length) {
      return groupedHubs;
    } else {
      // Set Subsites to corresponding parent site
      subSites.forEach((subSite: ISiteGroup) => {
        // Loop through groupedHubs to find the correct parent Hub by comparing SiteIds
        for (let i = 0; i < groupedHubs.length; i++) {
          if (groupedHubs[i].siteId === subSite.siteId) {
            if (siteInfo.HubSiteId === groupedHubs[i].siteId) {
              subSite.name = `${siteInfo.RootWeb.Title} > ${subSite.title}`;
            } else {
              subSite.name = `${siteInfo.RootWeb.Title} > ${groupedHubs[i].title} > ${subSite.title}`;
            }
            // Add to parent site
            groupedHubs.splice(i + 1, 0, subSite);
            break;
          }
        }
      });

      return groupedHubs;
    }
  }



  /*************************************************************************************
  * Filter batched SP Lists when Doc Libs are excluded
  *
  * @public
  * @param {ISPList[][]} batchedLists
  * @param {boolean} includeDocLibraries
  * @param {boolean} includeSystemLibraries
  * @memberof ListHelper
  *************************************************************************************/
  public filterBatchedLists(batchedLists: ISPList[][], includeDocLibraries: boolean, includeSystemLibraries: boolean): ISPList[][] {
    let filteredBatchedLists: ISPList[][];

    // Case: When System Libraries are included and Doc Libs are excluded, filter out Doc Libs
    if (includeSystemLibraries && !includeDocLibraries) {

      filteredBatchedLists = batchedLists.map((listsArr: ISPList[]): ISPList[] => {
        return listsArr.filter((list: ISPList) => {
          return (
            list.BaseTemplate !== 101 || 
            list.ListItemEntityTypeFullName === 'SP.Data.FormServerTemplatesItem' ||
            list.ListItemEntityTypeFullName === 'SP.Data.SiteAssetsItem' ||
            list.ListItemEntityTypeFullName === 'SP.Data.Style_x0020_LibraryItem'
          );
        });
      });

    } else {
      filteredBatchedLists = batchedLists;
    }

    return filteredBatchedLists;
  }


  /*************************************************************************************
  * Prepare indices of Grouped Hub Sites for Detail List Component
  *
  * @public
  * @param {ISiteGroup[]} groupedHubs
  * @param {ISPList[][]} batchedLists
  * @memberof ListHelper
  *************************************************************************************/
  public prepareNumberedGroupedHubs(groupedHubs: ISiteGroup[], batchedLists: ISPList[][]): ISiteGroup[] {
    const numberedGroupedHubs: ISiteGroup[] = groupedHubs.map((groupHub: ISiteGroup, groupHubIndex: number): ISiteGroup => {
      groupHub.count = batchedLists[groupHubIndex].length;

      if (groupHubIndex === 0) {
        groupHub.startIndex = groupHubIndex;
      } else {
        groupHub.startIndex = groupedHubs[groupHubIndex - 1].startIndex + groupedHubs[groupHubIndex - 1].count;
      }

      return groupHub;
    });

    return numberedGroupedHubs;
  }


  /*************************************************************************************
  * Prepare Lists for Grouped view
  *
  * @public
  * @param {ISiteGroup[]} numberedGroupedHubs
  * @param {ISPList[][]} filteredBatchedLists
  * @param {boolean} openLinksInTeams
  * @memberof ListHelper
  *************************************************************************************/
  public prepareGroupedLists(numberedGroupedHubs: ISiteGroup[], filteredBatchedLists: ISPList[][], openLinksInTeams: boolean): IList[] {

    const preparedGroupedLists: IList[] = filteredBatchedLists.reduce((groupedListArr: IList[], spListArr: ISPList[], batchedListsIndex): IList[]  => {
      const siteUrl: string = numberedGroupedHubs[batchedListsIndex].key;

      const formattedList: IList[] = this._formatLists(siteUrl, spListArr, openLinksInTeams); 

      return groupedListArr.concat(formattedList);
    }, []);

    return preparedGroupedLists;
  }


  /*************************************************************************************
  * Format SP Lists
  *
  * @private
  * @param {string} siteUrl
  * @param {ISPList[]} spListArr
  * @param {boolean} openLinksInTeams
  * @memberof ListHelper
  *************************************************************************************/
  private _formatLists(siteUrl: string, spListArr: ISPList[], openLinksInTeams: boolean): IList[] {
    // TODO: Check if this can be called in non-grouped methods to refactor redundant code
    const formattedLists: IList[] = spListArr.map((list: ISPList): IList => {
      let target: string;
      let listType: string;
      let modified: string;
      let tenantUrl: string;
      let dateObj: Date = new Date(list.LastItemModifiedDate);

      // Set Tenant Url
      if (list.ParentWebUrl.toLowerCase() === '/') {
        tenantUrl = siteUrl;
      } else {
        tenantUrl = siteUrl.toLowerCase().replace(list.ParentWebUrl.toLowerCase(), '');
      }
      // Set List Url
      const listUrl: string = tenantUrl + list.RootFolder.ServerRelativeUrl.toLowerCase();

      for (var i = 0; i < Constants.LISTTYPE.length; i++) {
        if (list.BaseTemplate === Constants.LISTTYPE[i].key) {
          listType = Constants.LISTTYPE[i].text;
        }
      }
      // Set whether SP List opens in Teams or in new Browser Tab
      target = openLinksInTeams && list.BaseTemplate !== 106 ? '_self' : '_blank';
      // Construct date string for UI
      modified = `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;

      return {
        type: listType,
        id: list.Id,
        iconUrl: list.ImageUrl,
        items: list.ItemCount,
        modified: modified,
        name: list.Title,
        url: listUrl,
        target: target
      };
    });

    return formattedLists;
  }


  /*************************************************************************************
  * Prepare Grouped Subsites
  *
  * @public
  * @param {ISiteGroup} rootGroup
  * @param {ISPWeb[]} subsites
  * @memberof ListHelper
  *************************************************************************************/
  public prepareGroupedSubSites(rootGroup: ISiteGroup, subsites: ISPWeb[]): ISiteGroup[] {

    let groupedSubsites: ISiteGroup[] = subsites.map((subsite: ISPWeb) => {
      const subsiteUrl: string = subsite.ServerRelativeUrl.split('/').pop();
      subsite.Url = `${rootGroup.key}/${subsiteUrl}`;

      const preparedGroup: ISiteGroup = {
        key: subsite.Url,
        name: `${rootGroup.name} > ${subsite.Title}`,
        startIndex: 0,
        count: 0,
        level: 0,
        title: subsite.Title
      };

      return preparedGroup;
    });
    // Set Root site as first in array
    groupedSubsites.unshift(rootGroup);

    return groupedSubsites;
  }


  /*************************************************************************************
  * Prepare Root Site Group
  *
  * @public
  * @param {ISPSite} siteInfo
  * @memberof ListHelper
  *************************************************************************************/
  public prepareRootGroup(siteInfo: ISPSite): ISiteGroup {
    const siteTitle: string = siteInfo.Url === siteInfo.RootWeb.Url ? siteInfo.RootWeb.Title : siteInfo.Url.split('/').pop();

    const rootGroup: ISiteGroup = {
      key: siteInfo.Url,
      name: siteTitle,
      startIndex: 0,
      count: 0,
      level: 0
    };

    return rootGroup;
  }
}
