// Import the providers and credential at the top of the page
import { Providers } from '@microsoft/mgt-element';
import { TeamsFxProvider } from '@microsoft/mgt-teamsfx-provider';
import { TeamsUserCredential, TeamsUserCredentialAuthConfig } from "@microsoft/teamsfx";
const authConfig: TeamsUserCredentialAuthConfig = {
    clientId: "0f0f6aac- da6d - 4a9a-938d - 42fb95cbda4c",
    initiateLoginEndpoint: "https://login.microsoftonline.com/common",
};
const scope = ["User.Read;MailboxSettings.Read;Mail.ReadWrite;Calendars.ReadWrite;Chat.ReadWrite;Tasks.ReadWrite;Directory.Read.All;Directory.ReadWrite.All;Team.ReadBasic.All;TeamSettings.Read.All;TeamSettings.ReadWrite.All;OnlineMeetingTranscript.Read.All;Files.Read.All;Sites.Read.All;Mail.Send;Notes.Create;Notes.ReadWrite;Notes.ReadWrite.All"];
const credential = new TeamsUserCredential(authConfig);
const provider = new TeamsFxProvider(credential, scope);
Providers.globalProvider = provider;
// Put these code in a call-to-action callback function to avoid browser blocking automatically showing up pop-ups. 
await credential.login(this.scope);
Providers.globalProvider.setState(ProviderState.SignedIn);