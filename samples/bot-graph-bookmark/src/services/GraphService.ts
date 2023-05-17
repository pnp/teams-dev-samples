import { createMicrosoftGraphClient, createMicrosoftGraphClientWithCredential, OnBehalfOfUserCredential } from "@microsoft/teamsfx";
import { Client } from "@microsoft/microsoft-graph-client";
import oboAuthConfig from "../authConfig";
import { IBookmarkForm } from "../cardModels";
import config from "../internal/config";

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

            const siteId = config.siteId;
            const listId = config.listId;
            const result = await this.graphClient.api(`/sites/${siteId}/lists/${listId}/items`)
                .post(listItem);

            return result;
        }
        catch (error) {
            throw error;
        }

    }

}
