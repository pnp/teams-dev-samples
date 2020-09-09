import { MSGraphClientFactory, MSGraphClient } from "@microsoft/sp-http";
import { IConfig } from "../model/IConfig";
import SPService from "./spServices";
import { IDocument } from "../model/IDocument";

export default class GraphService {
	private client: MSGraphClient;
	private spService: SPService;

	public async initialize (serviceScope, siteUrl: string) {
		const graphFactory: MSGraphClientFactory = serviceScope.consume(MSGraphClientFactory.serviceKey);
		this.spService = new SPService();
    this.spService.initialize(serviceScope, siteUrl);
		return graphFactory.getClient()
			.then((client) => {
				this.client = client;
				return Promise.resolve();
			});
	}

	public async getDocumentsForReview (): Promise<IDocument[]> {
		const today = new Date().toISOString().substr(0,10);
		const config: IConfig = await this.spService.getConfig();
		return this.client.api(`https://graph.microsoft.com/v1.0/sites/${config.siteID}/lists/${config.listID}/items?$filter=fields/NextReview lt '${today}'&expand=fields`)
					.get()
					.then((response) => {
						let documents: IDocument[] = [];
            response.value.forEach((doc) => {
              const nextReview = new Date(doc.fields.NextReview);
              let urgentLimit = new Date();
              urgentLimit.setDate(urgentLimit.getDate() - 7);
              const urgent: boolean = nextReview < urgentLimit;
              documents.push({ author: doc.createdBy.user.displayName, description: doc.fields.Description0, key: doc.id, modified: new Date(doc.lastModifiedDateTime), name: doc.fields.FileLeafRef, nextReview: nextReview, url: doc.webUrl, urgent: urgent });
            });            
            return documents;
					})
					.catch((error) => {
						console.log(error);  
						return [];
					});
	}
	
	public async setDocumentReviewed(itemID: string, fieldValueSet) {		
    const config: IConfig = await this.spService.getConfig();
		return this.client.api(`https://graph.microsoft.com/v1.0/sites/${config.siteID}/lists/${config.listID}/items/${itemID}/fields`)
      .patch(fieldValueSet)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error);
      });
	}
}