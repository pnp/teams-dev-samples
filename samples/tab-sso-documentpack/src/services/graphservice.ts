import { Client } from "@microsoft/microsoft-graph-client";
import { createMicrosoftGraphClientWithCredential, TeamsUserCredential } from "@microsoft/teamsfx";
import { resolve } from "dns";


import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { TeamsUserCredentialContext } from "../helpers/AuthHelper/TeamsUserCredentialContext";

export class GraphService {

    private static _instance: GraphService = new GraphService();

    constructor() {
        if (GraphService._instance) {
            throw new Error("Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.");
        }
        GraphService._instance = this;
    }

    public static getInstance(): GraphService {
        return GraphService._instance;
    }   


    public async GetUserProfile(): Promise<any> {
        let credential: TeamsUserCredential;
        try {

            credential = TeamsUserCredentialContext.getInstance().getCredential();
            const graphClient: Client = createMicrosoftGraphClientWithCredential(credential, [
                "User.Read"
            ]);
            const profile = await graphClient.api("/me").select('department,displayName,mail,jobTitle').get();
            let photoUrl = "";
            try {
                const photo = await graphClient.api("/me/photo/$value").get();
                photoUrl = URL.createObjectURL(photo);
            } catch {
                // Could not fetch photo from user's profile, return empty string as placeholder.
            }

            let data = {
                profile: profile,
                photoUrl: photoUrl
            };
            return data;

        }
        catch (error) {
            console.log("Error in GetUserProfile:", error);
            return null;
        }


    }

    
    public async getRecentDocuments(): Promise<any> {

        try {

            let credential: TeamsUserCredential;
            credential = TeamsUserCredentialContext.getInstance().getCredential();
            const graphClient: Client = createMicrosoftGraphClientWithCredential(credential, [
                "Files.Read.All"
            ]);
            const response = await graphClient.api("/me/drive/recent").top(5).get();           
            return response;
        }
        catch (error) {
            console.log("Error in getRecentDocuments:", error);
            return null;
        }


    }
}




