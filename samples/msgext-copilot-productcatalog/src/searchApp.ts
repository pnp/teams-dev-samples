import { default as axios } from "axios";
import * as querystring from "querystring";
import {
  TeamsActivityHandler,
  CardFactory,
  TurnContext,
  MessagingExtensionQuery,
  MessagingExtensionResponse,
} from "botbuilder";
import * as ACData from "adaptivecards-templating";
import productCard from "./adaptiveCards/productCard.json";
import config from "./config";

export class SearchApp extends TeamsActivityHandler {
  constructor() {
    super();
  }

  // Search.
  public async handleTeamsMessagingExtensionQuery(
    context: TurnContext,
    query: MessagingExtensionQuery
  ): Promise<MessagingExtensionResponse> {
    const searchQuery = query.parameters[0].value;
    var productName = this.getQueryData(query, "productName");
    var productDescription = this.getQueryData(query, "productDescription");
    var revenueType = this.getQueryData(query, "revenueType");
    var serviceArea = this.getQueryData(query, "serviceArea");
    var serviceAreaOwner = this.getQueryData(query, "serviceAreaOwner");

   
    const data = {
      productName: productName,
      productDescription: productDescription,
      revenueType: revenueType,
      serviceArea: serviceArea,
      serviceAreaOwner: serviceAreaOwner,
    };

    const attachments = [];
    try {
    // Invoke the Azure Function, passing in search query parameters
    const response = await axios.post(config.functionAppUrl, data);    
    response.data.forEach((obj) => {
      const template = new ACData.Template(productCard);
      const card = template.expand({
        $root: {
          productName: obj.productName,
          productDescription: obj.productDescription,
          skuid: obj.skuid,
          catalogue: obj.catalogue,
          revenueType: obj.revenueType,
          plPostingGroup: obj.plPostingGroup,
          serviceArea: obj.serviceArea,
          serviceGroup: obj.serviceGroup,
          serviceAreaOwner: obj.serviceAreaOwner,
          documents: obj.documents,

        },
      });
      const preview = CardFactory.heroCard(obj.productName);
      const attachment = { ...CardFactory.adaptiveCard(card), preview };
      attachments.push(attachment);
    });
    }
    catch (error) {
      console.error(error);
    }



    // const response = await axios.get(
    //   `http://registry.npmjs.com/-/v1/search?${querystring.stringify({
    //     text: searchQuery,
    //     size: 8,
    //   })}`
    // );
    
   

    return {
      composeExtension: {
        type: "result",
        attachmentLayout: "list",
        attachments: attachments,
      },
    };
  }

  private getQueryData(query: MessagingExtensionQuery, key: string): string {
    if (!query?.parameters?.length) {
      return '';
    }

    // Use Array.prototype.find to find the KeyValuePair with the specified key
    const foundPair = query.parameters.find(pair => pair.name === key);

    return foundPair?.value?.toString() ?? '';
  }
}
