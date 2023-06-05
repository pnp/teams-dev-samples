import { OnBehalfOfCredentialAuthConfig } from "@microsoft/teamsfx";
import config from "./internal/config";

const oboAuthConfig: OnBehalfOfCredentialAuthConfig = {
  authorityHost: config.authorityHost,
  clientId: config.clientId,
  clientSecret: config.clientSecret,
  tenantId: config.tenantId  
};

export default oboAuthConfig;