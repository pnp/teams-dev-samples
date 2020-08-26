import Axios, { AxiosRequestConfig } from "axios";
import qs = require("qs");
import { IDocument } from "../model/IDocument";

export default class GraphController {  
  public async getFiles(token: string, siteID: string, listID: string): Promise<IDocument[]> {  
    const today = new Date().toISOString().substr(0,10);
    const requestUrl: string = `https://graph.microsoft.com/v1.0/sites/${siteID}/lists/${listID}/items?$filter=fields/NextReview lt '${today}'&expand=fields`;
    
    return Axios.get(requestUrl, {
      headers: {          
          Authorization: `Bearer ${token}`
      }})
      .then(response => {
        let docs: IDocument[] = [];
        console.log(response.data.value);
        response.data.value.forEach(element => {
          docs.push({
            name: element.fields.FileLeafRef,
            description: element.fields.Description0,
            author: element.createdBy.user.displayName,
            url: element.webUrl,
            id: element.id,
            modified: new Date(element.lastModifiedDateTime)
          });
        });
        return docs;
      })
      .catch(err => {
        console.log(err);
        return [];
      });
  }

  public async updateItem(token: string, siteID: string, listID: string, itemID: string, nextReview: string) {
    const requestUrl: string = `https://graph.microsoft.com/v1.0/sites/${siteID}/lists/${listID}/items/${itemID}/fields`;
    const config: AxiosRequestConfig = {  headers: {      
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }};
    const fieldValueSet = {
      LastReviewed: new Date().toISOString(),
      NextReview: new Date(nextReview).toISOString()
    };
    Axios.patch(requestUrl, 
                fieldValueSet,
                config
    )
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
  }
}