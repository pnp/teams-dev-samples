import { AttachState, IFluidContainer,  SharedMap } from "fluid-framework";
import { AzureClient, AzureClientProps, AzureContainerServices, AzureFunctionTokenProvider, AzureMember } from "@fluidframework/azure-client";
import { SharedString } from "@fluidframework/sequence";
import { InitMindMapContainer } from "./model/MindMapFluidModel"
import config from "./config";
import { InsecureTokenProvider } from "@fluidframework/test-client-utils";

export const containerIdQueryParamKey = "containerId";

export const containerSchema = {
  initialObjects: {
    nodes: SharedMap,
    connections: SharedMap,
    title: SharedString
  },
};


function getConnectionConfig(user: AzureMember): AzureClientProps {
  if(config.FRS_local){
    return ({
      connection: {
        type: "local",
        tokenProvider: new InsecureTokenProvider("foobar", { id: user.userId ,
        userId: user.userId,
        userName: user.userName,
        connections: [],
      
      } as any),
        endpoint: "http://localhost:7070"
      }
    })
  }
  return ({
    connection: {
      type: "remote",
      tokenProvider: new AzureFunctionTokenProvider(
        config.FRS_TokenProviderURL
        , user
      ),
      tenantId: config.FRS_TenantId,
      endpoint: config.FRS_Endpoint
    }
  })
};


export async function createContainerID(user: MindMapUser): Promise<string> {
  const client = new AzureClient(getConnectionConfig(user));
  const { container } = await client.createContainer(containerSchema);
  InitMindMapContainer(container);
  console.log(container.attachState);
  let containerId = ""
  if(container.attachState === AttachState.Detached){
     containerId = await container.attach();
  }else {
    
  }

 
  return containerId;
  
  


};
export async function getContainer(id: string, user: MindMapUser): Promise<{
  container: IFluidContainer, services: AzureContainerServices
}> {
  const client = new AzureClient(getConnectionConfig(user));;
  return await client.getContainer(id, containerSchema);
};

export type MindMapUser = AzureMember<{ [key: string]: string }>;

export function getAzureMemberFromCtx(user: any): MindMapUser {
  return ({
    userId: user?.id,
    userName: user.userPrincipalName,
    additionalDetails: { displayName: user.displayName },
    connections:[]
  });
}