import { WebPartContext }               from "@microsoft/sp-webpart-base";
import { 
  SPHttpClient, 
  SPHttpClientResponse, 
  ISPHttpClientOptions, 
  IHttpClientOptions,
}                                       from '@microsoft/sp-http';
import { ISPList }                      from '../../interfaces/ISPList';
import { ISPDataSvc }                   from './ISPDataSvc';
import { ISPWeb }                       from '../../interfaces/ISPWeb';
import { ISPSite }                      from '../../interfaces/ISPSite';
import { IHubSitesResponse }            from '../../interfaces/IHubSites';
import { ISiteGroup }                   from "../../interfaces/ISiteGroup";
import { ICacheService, CacheTimeout }  from '../CacheService/ICacheService';
import  { CacheService }                from '../CacheService/CacheService';


export class SPDataSvc implements ISPDataSvc {
 
  private _context: WebPartContext;
  private cachService: ICacheService;

  constructor(Url: string, context: WebPartContext) {
    this._context = context;
    this.cachService = new CacheService(window.sessionStorage);
  }


  /*************************************************************************************
  * Gets Site info to determine if Site is a Hub Site
  *
  * @public
  * @param {string} siteUrl
  * @memberof SPDataSvc
  *************************************************************************************/
  public GetSiteInfo(siteUrl): Promise<ISPSite> {
    let errorMsg: string;

    return new Promise<any>((resolve, reject) => {
      this._context.spHttpClient.get(`${siteUrl}/_api/site?$select=HubSiteId,Id,IsHubSite,Url,RootWeb/Title,RootWeb/Url&$expand=RootWeb`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=minimalmetadata',
          'odata-version': ''
        }
      })
        .then((response: SPHttpClientResponse) => {
          if (response.ok) {
            response.json()
              .then((data: ISPSite) => {
                console.info("Successfully retreived SP Site Info: ", data);

                // Check if the Url in odata.id contains the Url in the Url Property of the response. 
                // If not, the request was from a subsite.
                // For display purposes, replace the URL property with the subsite URL from odata.id.
                // If yes, then keep original URL property.
                let url: string = data["odata.id"].replace(/\/_api\/site$/g, '');
                data.Url = url === data.Url ? data.Url : url;

                resolve(data);
              });
          }
          else {
            // Error message for UI
            if (response.statusText.trim().length === 0) {
              errorMsg = `[HTTP] ${response.status}. Failed to retrieve SP Site Info. Please enter a different Site URL or contact your SharePoint Admin.`;
            } else {
              errorMsg = `[HTTP] ${response.status} – ${response.statusText}. Failed to retrieve SP Site Info. Please enter a different Site URL or contact your SharePoint Admin.`;
            }
            // Error message for console
            console.error("Failed to retrieve SP Site Info: ", response);
            
            reject(errorMsg);
          }
        });
    });
  }


  /*************************************************************************************
  * Gets SP Lists for selected Site
  *
  * @public
  * @param {string} siteUrl
  * @param {boolean} clearCache
  * @param {boolean} includeDocLibraries
  * @param {boolean} includeEventLists
  * @param {boolean} includeCustomLists
  * @param {boolean} includeSystemLibraries
  * @memberof SPDataSvc
  *************************************************************************************/
  public GetSPLists(siteUrl: string, clearCache: boolean, includeDocLibraries: boolean, includeEventLists: boolean, includeCustomLists: boolean, includeSystemLibraries: boolean): Promise<ISPList[]> {
      // Cache Provider
      const cacheKey = siteUrl.toLowerCase();

      // Clear Cache when web part properties have changed
      if (clearCache) {
        console.info("Clearing session cache."); 

        return this.cachService.ClearAll()
          .then((): Promise<ISPList[]> => {
            return this._getCachedOrLiveSPLists(cacheKey, siteUrl, includeDocLibraries, includeEventLists, includeCustomLists, includeSystemLibraries);
          });
      } else {
        return this._getCachedOrLiveSPLists(cacheKey, siteUrl, includeDocLibraries, includeEventLists, includeCustomLists, includeSystemLibraries);
      }
  }


  /*************************************************************************************
  * Gets cached or live SP Lists for selected Site
  *
  * @private
  * @param {string} siteUrl
  * @param {boolean} includeDocLibraries
  * @param {boolean} includeEventLists
  * @param {boolean} includeCustomLists
  * @param {boolean} includeSystemLibraries
  * @memberof SPDataSvc
  *************************************************************************************/
  private _getCachedOrLiveSPLists(cacheKey: string, siteUrl: string, includeDocLibraries: boolean, includeEventLists: boolean, includeCustomLists: boolean, includeSystemLibraries: boolean): Promise<ISPList[]> {
    let errorMsg: string;

    return new Promise<ISPList[]>((resolve, reject) => {
      this.cachService.Get(cacheKey)
        .then((lists: ISPList[]) => {
          // Get live SP Lists
          if (!lists) {
            // Set API Url to filter out lists based on web part properties
            // IsCatalog eq false: removes Style Library
            // IsApplicationList eq false: removes Site Pages. Also removes Site Assets (but in Subsites only)
            // ListItemEntityTypeFullName ne 'SP.Data.FormServerTemplatesItem': removes Form Templates
            // ListItemEntityTypeFullName ne 'SP.Data.SiteAssetsItem': removes Site Assets
            let apiEndpoint: string = `${siteUrl}/_api/web/lists?$select=Id,Title,ImageUrl,ItemCount,LastItemModifiedDate,BaseTemplate,ListItemEntityTypeFullName,ParentWebUrl,RootFolder/ServerRelativeUrl&$expand=RootFolder&$filter=(IsPrivate eq false) and (Hidden eq false)`;

            // 2 Cases:
            // Do not include System Libraries, include Doc Libraries
            // Do not include System Libraries, do not include Doc Libraries
            if (!includeSystemLibraries && !includeDocLibraries) {
              apiEndpoint = `${apiEndpoint} and (IsCatalog eq false) and (IsApplicationList eq false) and (ListItemEntityTypeFullName ne 'SP.Data.FormServerTemplatesItem') and (ListItemEntityTypeFullName ne 'SP.Data.SiteAssetsItem') and (BaseTemplate ne 101)`;
            } else if (!includeSystemLibraries && includeDocLibraries) {
              apiEndpoint = `${apiEndpoint} and (IsCatalog eq false) and (IsApplicationList eq false) and (ListItemEntityTypeFullName ne 'SP.Data.FormServerTemplatesItem') and (ListItemEntityTypeFullName ne 'SP.Data.SiteAssetsItem')`;
            }

            if (!includeEventLists) {
              apiEndpoint = `${apiEndpoint} and (BaseTemplate ne 106)`;
            }
            if (!includeCustomLists) {
              apiEndpoint = `${apiEndpoint} and (BaseTemplate ne 100)`;
            }

            this._context.spHttpClient.get(
              apiEndpoint,
              SPHttpClient.configurations.v1,
              {
                headers: {
                  'Accept': 'application/json;odata=nometadata',
                  'odata-version': ''
                }
              })
                .then((response: SPHttpClientResponse) => {
                  if (response.ok) {
                    response.json()
                      .then((data: { value: ISPList[] }) => {
                        console.info("Successfully retreived SP Lists: ", data);

                        // Set SP lists to cache
                        this.cachService.Set(cacheKey, data.value, CacheTimeout.default)
                          .then((didSet: boolean) => {
                            console.log("Set lists to Cache: ", didSet);

                            resolve(data.value);
                          });
                      });
                  }
                  else {
                    console.error("Failed to retrieve lists: ", response);
                    // Error message for UI
                    if (response.statusText.trim().length === 0) {
                      errorMsg = `[HTTP] ${response.status}. Failed to retrieve Lists. Please enter a different Site URL or contact your SharePoint Admin.`;
                    } else {
                      errorMsg = `[HTTP] ${response.status} – ${response.statusText}. Failed to retrieve Lists. Please enter a different Site URL or contact your SharePoint Admin.`;
                    }
                    
                    reject(errorMsg);
                  }
                });
          // Get Cached SP Lists
          } else {
            console.info('Successfully retreived SP Lists from Cache: ', lists);

            resolve(lists);
          }
        });
    });
  }


  /*************************************************************************************
  * Gets SP Lists for Hub Site and all associated sites
  *
  * @public
  * @param {ISiteGroup[]} sites
  * @param {boolean} includeDocLibraries
  * @param {boolean} includeEventLists
  * @param {boolean} includeCustomLists
  * @param {boolean} includeSystemLibraries
  * @memberof SPDataSvc
  *************************************************************************************/
  public GetSPListsBatch(sites: ISiteGroup[], includeDocLibraries: boolean, includeEventLists: boolean, includeCustomLists: boolean, includeSystemLibraries: boolean): Promise<ISPList[][]> {
    // Set API Url to filter out lists based on web part properties
    let apiUrl: string = "_api/web/lists?$select=Id,Title,ImageUrl,ItemCount,LastItemModifiedDate,BaseTemplate,ListItemEntityTypeFullName,ParentWebUrl,RootFolder/ServerRelativeUrl&$expand=RootFolder&$filter=(IsPrivate eq false) and (Hidden eq false)";

    // 2 Cases:
    // Do not include System Libraries, Include Doc Libraries
    // Do not include System Libraries, Do Not Include Doc Libraries
    if (!includeSystemLibraries && !includeDocLibraries) {
      apiUrl = `${apiUrl} and (IsCatalog eq false) and (IsApplicationList eq false) and (ListItemEntityTypeFullName ne 'SP.Data.FormServerTemplatesItem') and (ListItemEntityTypeFullName ne 'SP.Data.SiteAssetsItem') and (BaseTemplate ne 101)`;
    } else if (!includeSystemLibraries && includeDocLibraries) {
      apiUrl = `${apiUrl} and (IsCatalog eq false) and (IsApplicationList eq false) and (ListItemEntityTypeFullName ne 'SP.Data.FormServerTemplatesItem') and (ListItemEntityTypeFullName ne 'SP.Data.SiteAssetsItem')`;
    }

    if (!includeEventLists) {
      apiUrl = `${apiUrl} and (BaseTemplate ne 106)`;
    }
    if (!includeCustomLists) {
      apiUrl = `${apiUrl} and (BaseTemplate ne 100)`;
    }

    return new Promise<any>((resolve, reject) => {
      // Array of promises to retrieve SP Lists from hub site and associated sites
      const PromiseArray: Promise<ISPList[]>[] = sites.map((site: ISiteGroup): Promise<ISPList[]> => {
        // Promise for retrieving SP Lists from site
        return new Promise<ISPList[]>((resolveListRequest, rejectListRequest) => {
          
          const apiEndpoint: string = `${site.key}/${apiUrl}`;

          let errorMsg: string;

          this._context.spHttpClient.get(
            apiEndpoint,
            SPHttpClient.configurations.v1,
            {
              headers: {
                'Accept': 'application/json;odata=nometadata',
                'odata-version': ''
              }
            })
              .then((response: SPHttpClientResponse) => {
                if (response.ok) {
                  response.json()
                    .then((data: { value: ISPList[] }) => {
                      console.info("Successfully retreived SP Lists: ", data);

                      resolveListRequest(data.value);
                    });
                }
                else {
                  console.error("Failed to retrieve lists: ", response);
                  // Error message for UI
                  if (response.statusText.trim().length === 0) {
                    errorMsg = `[HTTP] ${response.status}. Failed to retrieve Lists. Please enter a different Site URL or contact your SharePoint Admin.`;
                  } else {
                    errorMsg = `[HTTP] ${response.status} – ${response.statusText}. Failed to retrieve Lists. Please enter a different Site URL or contact your SharePoint Admin.`;
                  }
                  
                  rejectListRequest(errorMsg);
                }
              });
        });
      });
      
      // Execute all promises
      Promise.all(PromiseArray)
        .then((data: ISPList[][]) => {
          console.info("Succesfully retrieved SP Lists in batch: ", data);

          resolve(data);
        })
        .catch((error: any) => {
          // TODO: handle batch error
          reject(error);
        });
    });
  }


  /*************************************************************************************
  * Gets all Subsites for selected site
  *
  * @public
  * @param {string} siteUrl
  * @memberof SPDataSvc
  *************************************************************************************/
  public GetSPSubSites(siteUrl: string): Promise<ISPWeb[]> {
    let errorMsg: string;

    return new Promise<any>((resolve, reject) => {
      this._context.spHttpClient.get(`${siteUrl}/_api/web/webinfos?$select=Id,ServerRelativeUrl,Title`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'odata-version': ''
        }
      })
        .then((response: SPHttpClientResponse) => {
          if (response.ok) {
            response.json()
              .then((data: { value: ISPWeb[] }) => {
                console.info("Succesfully retreived SP Subsites: ", data);
                
                resolve(data.value);
              });
          }
          else {
            console.error("Failed to retrieve SP Subsites: ", response);
            // Error message for UI
            if (response.statusText.trim().length === 0) {
              errorMsg = `[HTTP] ${response.status}. Please try a different Site URL or contact your SharePoint Admin.`;
            } else {
              errorMsg = `[HTTP] ${response.status} – ${response.statusText}`;
            }
            reject(errorMsg);
          }
        });
    });
  }


  /*************************************************************************************
  * Gets Hub API Auth Token to call SharePoint Home Service API
  *
  * @private
  * @param {string} hubSiteUrl
  * @memberof SPDataSvc
  *************************************************************************************/
  private _getHubApiToken(hubSiteUrl: string): Promise<any> {
    let errorMsg: string;

    return new Promise<any>((resolve, reject) => {
      const restQuery = `${hubSiteUrl}/_api/sphomeservice/context?$expand=Token,Payload`;
      const httpClientOptions: ISPHttpClientOptions = {};

      this._context.spHttpClient.fetch(restQuery, SPHttpClient.configurations.v1, httpClientOptions)
        .then((response: SPHttpClientResponse) => {
          if (response.ok) {
            response.json()
              .then((data: any) => {
                console.info("Successfully retrieved Hub API Token");
                // Improvement: Grab the Hub api URL from: responseJson.Urls
                resolve(data);
              });
          } else {
            console.error("Failed to retrieve Hub API Token: ", response);
            // Error message for UI
            if (response.statusText.trim().length === 0) {
              errorMsg = `[HTTP] ${response.status}. Failed to retrieve Hub API Token.`;
            } else {
              errorMsg = `[HTTP] ${response.status} – ${response.statusText}. Failed to retrieve Hub API Token`;
            }

            reject(errorMsg);
          }
        });
    });
  }


  /*************************************************************************************
  * Gets the following (in no particular order): Hubsite, Child hubsites, and subsites of the Child hubsite
  *
  * @private
  * @param {string} hubUrl
  * @param {string} hubId
  * @memberof SPDataSvc
  *************************************************************************************/
  public GetAssociatedHubSites(hubUrl: string, hubId: string): Promise<IHubSitesResponse> {
    let errorMsg: string;

    return new Promise<IHubSitesResponse>((resolve, reject) => {
      this._getHubApiToken(hubUrl)
        .then((token: any) => {
          // count limit set to 100, this could be a limiting factor
          const restQuery = `${token.Token.resource}/api/v1/sites/hub/feed?departmentId=${hubId}&acronyms=true&start=0&count=100`;

          const httpClientOptions: IHttpClientOptions = {
            headers: {
              'authorization': `Bearer ${token.Token.access_token}`,
              'sphome-apicontext': token.Payload
            }
          };

          this._context.httpClient.fetch(restQuery, SPHttpClient.configurations.v1, httpClientOptions)
            .then((response: SPHttpClientResponse) => {
              if (response.ok) {
                response.json()
                  .then((responseJson: IHubSitesResponse) => {
                    console.info("Successfully retrieved Hubsites, child hubsites, and their subsites: ", responseJson);

                    resolve(responseJson);
                  });
              } else {
                console.error("Failed to retrieve Hubsites from SharePoint Home Service API: ", response);
                // Error message for UI
                if (response.statusText.trim().length === 0) {
                  errorMsg = `[HTTP] ${response.status}. Failed to retrieve Hubsites and Child hubsites.`;
                } else {
                  errorMsg = `[HTTP] ${response.status} – ${response.statusText}. Failed to retrieve Hubsites and Child hubsites.`;
                }

                reject(errorMsg);
              }
            });
        })
        .catch((tokenErrorMsg: string) => {
          // TODO: handle Auth Token failure
          reject(tokenErrorMsg);
        });
    });
  }
}
