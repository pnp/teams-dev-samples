import { ClientSecretCredential } from "@azure/identity";
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { OnlineMeeting } from "@microsoft/microsoft-graph-types";
import 'isomorphic-fetch';

export class Graph {
    private client: Client;
    private clientSecretCredential: ClientSecretCredential;

    constructor() {
        this.clientSecretCredential = new ClientSecretCredential(
            process.env.MicrosoftAppTenantId,
            process.env.MicrosoftAppId,
            process.env.MicrosoftAppPassword
        );
    }

    async ensureGraphClient() {
        if (!this.client) {
            const authProvider = new TokenCredentialAuthenticationProvider(
                this.clientSecretCredential, {
                scopes: ['https://graph.microsoft.com/.default']
            });

            this.client = Client.initWithMiddleware({
                debugLogging: true,
                defaultVersion: "v1.0",
                authProvider: authProvider
            });
        }
    }

    async createOnlineMeeting(userId: string, startDateTime: string, endDateTime: string) {
        await this.ensureGraphClient();
        const onlineMeeting: OnlineMeeting = {
            startDateTime,
            endDateTime,
            subject: "Remote assistance"
        }
        return await this.client
            .api(`/users/${userId}/onlineMeetings`)
            .post(onlineMeeting)
            .then((res) => {
                return res as OnlineMeeting;
            })
            .catch((err) => {
                throw err;
            });
    }

}