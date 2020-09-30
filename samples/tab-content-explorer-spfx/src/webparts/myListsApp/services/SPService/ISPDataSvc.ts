import { IHubSitesResponse }    from '../../interfaces/IHubSites';
import { ISPWeb }               from '../../interfaces/ISPWeb';
import { ISPSite }              from '../../interfaces/ISPSite';
import { ISPList }              from '../../interfaces/ISPList';
import { ISiteGroup }           from "../../interfaces/ISiteGroup";


export interface ISPDataSvc {
    GetSiteInfo(siteUrl: string): Promise<ISPSite>;
    GetSPLists(siteUrl: string, clearCache: boolean, includeDocLibraries: boolean, includeEventLists: boolean, includeCustomLists: boolean, includeSystemLibraries: boolean): Promise<ISPList[]>;
    GetSPListsBatch(sites: ISiteGroup[], includeDocLibraries: boolean, includeEventLists: boolean, includeCustomLists: boolean, includeSystemLibraries: boolean): Promise<ISPList[][]>;
    GetSPSubSites(siteUrl: string): Promise<ISPWeb[]>;
    GetAssociatedHubSites(hubUrl: string, hubId: string): Promise<IHubSitesResponse>;
}
