import { ITokenProvider, ITokenResponse } from "@fluidframework/routerlicious-driver";
import axios from "axios";
import { AzureMember } from "@fluidframework/azure-client";

/**
 * Token Provider implementation for connecting to an Azure Function endpoint for
 * Azure Fluid Relay token resolution. Incl. user auth towards Azure Function
 */
export class AzureFunctionTokenProviderSec implements ITokenProvider {
    /**
     * Creates a new instance using configuration parameters.
     * @param azFunctionUrl - URL to Azure Function endpoint
     * @param user - User object
     */
    constructor(
        private readonly azFunctionUrl: string,
        private readonly authToken: string,
        private readonly user?: Pick<AzureMember, "userId" | "userName" | "additionalDetails">,        
    ) { }

    public async fetchOrdererToken(tenantId: string, documentId?: string): Promise<ITokenResponse> {
        return {
            jwt: await this.getToken(tenantId, documentId),
        };
    }

    public async fetchStorageToken(tenantId: string, documentId: string): Promise<ITokenResponse> {
        return {
            jwt: await this.getToken(tenantId, documentId),
        };
    }

    private async getToken(tenantId: string, documentId: string | undefined): Promise<string> {
        const response = await axios.get(this.azFunctionUrl, {
            headers: {
                Authorization: `Bearer ${this.authToken}`
            },
            params: {
                tenantId,
                documentId,
                userId: this.user?.userId,
                userName: this.user?.userName,
                additionalDetails: this.user?.additionalDetails,
            },
        });
        return response.data as string;
    }
}