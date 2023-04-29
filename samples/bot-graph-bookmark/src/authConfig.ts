import { OnBehalfOfCredentialAuthConfig } from "@microsoft/teamsfx";
import config from "./internal/config";

const oboAuthConfig: OnBehalfOfCredentialAuthConfig = {
  authorityHost: config.authorityHost,
  clientId: config.clientId,
  tenantId: config.tenantId,
  clientSecret: config.clientSecret,
};

export default oboAuthConfig;