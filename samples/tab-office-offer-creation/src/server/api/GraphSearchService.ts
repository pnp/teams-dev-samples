import Axios, { AxiosRequestConfig } from "axios";
import * as debug from 'debug';
import { IOfferDocument } from "../../model/IOfferDocument";

const log = debug('msteams');

export default class GraphSearchService {
  public async getFiles(token: string, query: string): Promise<IOfferDocument[]> {
    let queryString = 'ContentTypeID:0x0101003656A003937692408E62ADAA56A5AEEF*';
    if (query !== "")  {
      queryString += ` AND ${query}`;
    }
    const searchResponse = {
      requests: [
        { entityTypes: ['driveItem'],
          query: {
            queryString: queryString
          }
        }
      ]};
    const requestUrl: string = `https://graph.microsoft.com/v1.0/search/microsoft.graph.query`;
    return Axios.post(requestUrl,
      searchResponse,
      {
        headers: {          
          Authorization: `Bearer ${token}`
      }})
      .then(response => {
        let docs: IOfferDocument[] = [];
        response.data.value[0].hitsContainers[0].hits.forEach(element => {
          docs.push({
            name: element.resource.name,
            description: element.summary,
            author: element.resource.createdBy.user.displayName,
            url: element.resource.webUrl,
            id: element.resource.parentReference.sharepointIds.listItemId,
            modified: new Date(element.resource.lastModifiedDateTime)
          });
        });
        return docs;
      })
      .catch(err => {
        log(err);
        return [];
      });
  }

  public async reviewItem(token: string, itemID: string, user: string, userDisplayName: string): Promise<IOfferDocument> {
    const currentItem = await this.getItem(token, itemID);
    if (currentItem.reviewer === '') {
      let requestUrl: string = await this.getSiteAndListByPath(token, process.env.SiteUrl!);
      // Get user LookupID
      const userInfoListID = await this.getUserInfoListID(token, requestUrl);
      const userLookupID = await this.getUserLookupID(token, requestUrl, userInfoListID, user);
      requestUrl += `/${itemID}/fields`;
      const config: AxiosRequestConfig = {  headers: {      
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }};
      const fieldValueSet = {
        OfferingReviewedDate: new Date().toISOString(),
        OfferingReviewerLookupId: userLookupID
      };
      try {
        const response = await Axios.patch(requestUrl, 
          fieldValueSet,
          config
        );
        const reviewedDoc: IOfferDocument = {
          name: response.data.Title,
          author: currentItem.author,
          description: response.data.OfferingDescription,
          id: response.data.id,
          modified: new Date(response.data.Modified),
          url: currentItem.url,
          reviewedOn: new Date(response.data.OfferingReviewedDate),
          reviewer: userDisplayName
        }
        return reviewedDoc;
      }
      catch(error) {
        log(error);
        return currentItem;
      }
    }
    else {
      return currentItem;
    }
  }

  public async getItem(token: string, itemID: string): Promise<IOfferDocument> {
    let requestUrl: string = await this.getSiteAndListByPath(token, process.env.SiteUrl!);  
    requestUrl += `/${itemID}?$expand=fields($select=Title,OfferingDescription,id,Author,OfferingReviewedDate,OfferingReviewer,OfferingSubmitter,SubmittedOn,PublishedURL),driveItem($select=id)`;
    const config: AxiosRequestConfig = {  headers: {      
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }};
    return Axios.get(requestUrl,                
              config
    )
    .then((response) => {
      const item: IOfferDocument = {
        id: itemID,
        fileId: response.data.driveItem.id,
        name: response.data.fields.Title,
        description: response.data.fields.OfferingDescription,
        url: response.data.webUrl,
        author: response.data.fields.Author,
        modified: new Date(response.data.lastModifiedDateTime),
        reviewer: response.data.fields.OfferingReviewer ? response.data.fields.OfferingReviewer : '',
        reviewedOn: response.data.fields.OfferingReviewedDate ? new Date(response.data.fields.OfferingReviewedDate) : undefined,
        publisher: response.data.fields.OfferingSubmitter ? response.data.fields.OfferingSubmitter : '',
        publishedOn: response.data.fields.SubmittedOn ? new Date(response.data.fields.SubmittedOn) : undefined,
        publishedFileUrl: response.data.fields.PublishedURL ? response.data.fields.PublishedURL : ''
      }
      return Promise.resolve(item);
    })
    .catch((error) => {
      log(error);
      return Promise.reject(new Error("Unable to retrieve current item"));
    });
  }

  public async publishItem(token: string, fileName: string, itemID: string, fileID: string, user: string, userDisplayName: string): Promise<IOfferDocument> {
    let requestUrl: string = await this.getSiteAndListByPath(token, process.env.SiteUrl!);
    let driveRequestUrl = requestUrl.split('/lists')[0];
    driveRequestUrl += `/drive`;
    const pdfFile = await this.downloadTmpFileAsPDF(fileID, driveRequestUrl, fileName, token);
    const webUrl = await this.uploadFileToTargetSite(pdfFile, token, driveRequestUrl);
    const updatedItem = await this.updatePublishedItem(token, itemID, user, webUrl, userDisplayName);
    return updatedItem;
  }

  private async getSiteAndListByPath (accessToken: string, siteUrl: string): Promise<string> {
    const siteURL = new URL(siteUrl);
    const domain = siteURL.hostname;
    const path = siteURL.pathname;
    const apiSiteUrl =`https://graph.microsoft.com/v1.0/sites/${domain}:/${path}?$expand=drives`;
    try {
      const siteResponse = await Axios.get(apiSiteUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const requestUrl = `https://graph.microsoft.com/v1.0/sites/${siteResponse.data.id}/lists/${siteResponse.data.drives[0].name}/items`;
      return requestUrl;
    }
    catch (error) {
      log("Error while retrieving siteID: ")
      log(error);
      return "";
    }
  }

  private async getUserInfoListID (accessToken: string, requestUrl: string): Promise<string> {
    let listRequestUrl = requestUrl.split('/lists')[0];
    listRequestUrl += "/lists?$select=name,webUrl,displayName,Id,system";
    try {
      const response = await Axios.get(listRequestUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const lists: any[] = response.data.value;
      let listID = "";
      lists.forEach((l) => {
        if (l.webUrl.endsWith('/_catalogs/users')) {
          listID = l.id;
        }
      });
      return listID;
    }
    catch (error) {
      log("Error while retrieving listID: ")
      log(error);
      return "";
    }
  }

  private async getUserLookupID (accessToken: string, requestUrl: string, listID: string, userName: string): Promise<string> {
    let listRequestUrl = requestUrl.split('/lists')[0];
    listRequestUrl += `/lists/${listID}/items?$expand=fields&$filter=fields/UserName eq '${userName}'`;
    try {
      const response = await Axios.get(listRequestUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Prefer': 'HonorNonIndexedQueriesWarningMayFailRandomly' // No chance to index User Information List
        }
      });
      return response.data.value[0].id;
    }
    catch (error) {
      log("Error while retrieving userID: ")
      log(error);
      return "";
    }
  }

  private async downloadTmpFileAsPDF (fileID: string, driveRequestUrl: string, fileName: string, accessToken: string): Promise<any> {
    driveRequestUrl += `/items/${fileID}/content?format=PDF`;
    return Axios.get(driveRequestUrl, {
                    responseType: 'arraybuffer', // no 'blob' as 'blob' only works in browser
                    headers: {          
                        Authorization: `Bearer ${accessToken}`
                    }})
                    .then(response => {
                      const respFile = { data: response.data, name: `${fileName}.pdf`, size: response.data.length };
                      return respFile;
                    }).catch(err => {
                      log(err);
                      return null;
                    });
  }

  private async uploadFileToTargetSite (file: File, accessToken: string, driveUrl: string): Promise<string> {
    driveUrl += `/root:/Published/${file.name}:/content`;
    if (file.size <(4 * 1024 * 1024)) {
      const fileBuffer = file as any; 
      return Axios.put(driveUrl, fileBuffer.data, {
                  headers: {          
                      Authorization: `Bearer ${accessToken}`
                  }})
                  .then(response => {
                    log(response);
                    const webUrl = response.data.webUrl;
                    return webUrl;
                  }).catch(err => {
                    log(err);
                    return null;
                  });
    }
    else {
      // File.size>4MB, refer to https://mmsharepoint.wordpress.com/2020/01/12/an-outlook-add-in-with-sharepoint-framework-spfx-storing-mail-with-microsoftgraph/
      return "";
    }
  }

  private async updatePublishedItem (token: string, itemID: string, user: string, publishedFileUrl: string, userDisplayName: string): Promise<IOfferDocument> {
    const currentItem = await this.getItem(token, itemID);
    if (currentItem.publisher === '') {
      let requestUrl: string = await this.getSiteAndListByPath(token, process.env.SiteUrl!);
      // Get user LookupID
      const userInfoListID = await this.getUserInfoListID(token, requestUrl);
      const userLookupID = await this.getUserLookupID(token, requestUrl, userInfoListID, user);
      requestUrl += `/${itemID}/fields`;
      const config: AxiosRequestConfig = {  headers: {      
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }};
      const fieldValueSet = {
        SubmittedOn: new Date().toISOString(),
        OfferingSubmitterLookupId: userLookupID,
        PublishedURL: publishedFileUrl
      };
      try {
        const response = await Axios.patch(requestUrl, 
          fieldValueSet,
          config
        );
        const publishedDoc: IOfferDocument = {
          name: response.data.Title,
          author: currentItem.author,
          description: response.data.OfferingDescription,
          id: response.data.id,
          modified: new Date(response.data.Modified),
          url: currentItem.url,
          reviewedOn: new Date(response.data.OfferingReviewedDate),
          reviewer: currentItem.reviewer,
          publishedFileUrl: publishedFileUrl,
          publishedOn: new Date(response.data.SubmittedOn),
          publisher: userDisplayName
        }
        return publishedDoc;
      }
      catch(error) {
        log(error);
        return currentItem;
      }
    }
    else {
      return currentItem;
    }
  }
}