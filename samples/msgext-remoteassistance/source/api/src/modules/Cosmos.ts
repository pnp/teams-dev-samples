import { ContainerDefinition, CosmosClient, CosmosClientOptions, PartitionKeyDefinition, SqlQuerySpec } from "@azure/cosmos";
import { ManagedIdentityCredential } from "@azure/identity";
import { OnlineMeeting } from "@microsoft/microsoft-graph-types";

export class CosmosDB {

    private readonly database: string = "remoteAssistance"
    private readonly container: string = "teamsMeetings";
    private cosmosClient: CosmosClient;

    public constructor(endpoint: string, key?: string) {
        let cosmosClientOptions: CosmosClientOptions;
        try {
            if (endpoint && key) {
                // Use endpoint and key (for local dev and customer hosted)
                console.info(`Connecting to CosmosDB '${endpoint}' using Key`);
                cosmosClientOptions = { endpoint, key };
            } else if (endpoint) {
                // Use MSI
                console.info(`Connecting to CosmosDB '${endpoint}' using MSI`);
                cosmosClientOptions = {
                    endpoint, aadCredentials: new ManagedIdentityCredential({
                        clientId: process.env.AZURE_CLIENT_ID
                    })
                }
            } else {
                console.error("Unable to create client due to missing endpoint and/or key");
                throw new Error("Unable to create client due to missing endpoint and/or key");
            }
            // Create cosmos client
            this.cosmosClient = new CosmosClient(cosmosClientOptions);
            console.info("Connected to CosmosDB successfully");
        } catch (error) {
            console.error("Error creating CosmosDB Client", error);
            throw new Error("Error creating CosmosDB Client");
        }
    }

    private async ensureContainer(container: string, partitionKey?: string, uniqueKeys?: string[], timeToLive?: number, attempt: number = 1): Promise<void> {
        try {
            // prepare container definition
            const PartitionKeyDefinition: PartitionKeyDefinition = {
                paths: [partitionKey || "/id"]
            };
            const containerDef: ContainerDefinition = {
                id: container,
                partitionKey: PartitionKeyDefinition,
                uniqueKeyPolicy: uniqueKeys ? { uniqueKeys: uniqueKeys.map(key => ({ paths: [key] })) } : undefined,
                defaultTtl: timeToLive
            };

            await this.cosmosClient
                .database(this.database)
                .containers
                .createIfNotExists(containerDef);

        } catch (err) {
            const error = err as any;
            this.handleError(error);
        }
    }

    public async init() {
        await this.cosmosClient.databases.createIfNotExists({ id: this.database });
        await this.ensureContainer(this.container, "/id");
    }

    private handleError(error: any) {
        console.error("CosmosDB operation has failed with the error:", error);
        throw new Error(`CosmosDB operation has failed with the error: ${error}`);
    }

    public async getTeamsMeetingByMeetingJoinId(meetingJoinId: string): Promise<OnlineMeeting> {
        const query: SqlQuerySpec = {
            query: "SELECT * FROM c WHERE c.joinMeetingIdSettings.joinMeetingId = @joinMeetingId",
            parameters: [
                {
                    name: "@joinMeetingId",
                    value: meetingJoinId
                }
            ]
        };

        try {
            // Get data from Cosmos container
            const result = await this.cosmosClient
                .database(this.database)
                .container(this.container)
                .items
                .query(query)
                .fetchAll();

            if (result.resources && result.resources.length > 0) {
                return result.resources[0];
            } else {
                return undefined;
            }
        } catch (error) {
            this.handleError(error);
        }
    }

    public async upsertTeamsMeeting(onlineMeeting: OnlineMeeting) {
        try {
            await this.cosmosClient
                .database(this.database)
                .container(this.container)
                .items
                .upsert(onlineMeeting);
        } catch (error) {
            this.handleError(error);
        }
    }

}
