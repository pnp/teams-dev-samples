import { createMicrosoftGraphClient, createMicrosoftGraphClientWithCredential, OnBehalfOfUserCredential } from "@microsoft/teamsfx";
import { Client } from "@microsoft/microsoft-graph-client";
import oboAuthConfig from "../authConfig";
import { IBookmarkForm } from "../cardModels";

export class GraphService {
    private static graphClient: Client;

    public static Init(ssoToken: string) {
        const oboCredential = new OnBehalfOfUserCredential(ssoToken, oboAuthConfig);
        GraphService.graphClient = createMicrosoftGraphClientWithCredential(oboCredential, [
            "Sites.ReadWrite.All",
        ]);
    }

    public static async createListItem(data: IBookmarkForm) {
        try {
            const me = await this.graphClient.api("/me").get();


            const listItem = {
                fields: data
            };

            const siteId = "ejazhussain.sharepoint.com,72d7b565-87a8-416b-9651-cce091d94b16,efa74c58-a1b4-4dc5-9796-c08414f1ad7e";
            const listId = "4306f271-0182-46b9-bfa6-d18fb2150204"
            const result = await this.graphClient.api(`/sites/${siteId}/lists/${listId}/items`)
                .post(listItem);

            return result;
        }
        catch (error) {
            throw error;
        }

    }

}
