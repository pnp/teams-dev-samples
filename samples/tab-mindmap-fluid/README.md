# MindMap based on Fluid

## Summary

Group Chat
![MindMap in group chat tab](./assets/group_userChat.gif)
Channel Tab
![MindMap in channel tab](./assets/channel.gif)
Meeting Tab (GO on Stage)
![MindMap in meeting tab and Go Live](./assets/meeting_golive.gif)

## Prerequisites

- [Node.js](https://nodejs.org/), supported versions: 18
- An M365 account. If you do not have M365 account, apply one from [M365 developer program](https://developer.microsoft.com/microsoft-365/dev-program)
- [Set up your dev environment for extending Teams apps across Microsoft 365](https://aka.ms/teamsfx-m365-apps-prerequisites)

> Please note that after you enrolled your developer tenant in Office 365 Target Release, it may take couple days for the enrollment to take effect.

- [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) version 5.0.0 and higher or [TeamsFx CLI](https://aka.ms/teamsfx-cli)

## Minimal Path to Awesome

- Clone this repository (or [download this solution as a .ZIP file](https://pnp.github.io/download-partial/?url=https://github.com/pnp/teams-dev-samples/tree/main/samples/tab-mindmap-fluid) then unzip it)
- From your command line, change your current directory to the directory containing this sample (`tab-mindmap-fluid`, located under `samples`)
- in the command line run:
  - `code .`
  - Visual Studio Code Extention: Start debugger
  ![VScode Start debugger](./assets/install/vscode_startdebugger.png)
  - First Deployment with Teams Toolkit go to ()
  - Application stated you see  2 running Tasks
  ![VScode Start debugger](./assets/install/vscode_taskrunner.png)
  
## Getting Started With Azure Fluid Relay Testing

Work in Progress for a better doumentation
Setup Your Azure Function and Deploy Azure function from Folder `APIC`
Setup Your Fluid Relay Service
Setup `config.ts`

```
const config = {
  FRS_local:false,
  FRS_TokenProviderURL:"https://yourAZFunction.azurewebsites.net/api/GetToken",
  FRS_TenantId: "your valid Guid",
  FRS_Endpoint:"https://eu.fluidrelay.azure.com"
};
```

## Deploy Application

Be sure this is a Sample and it is not production Ready.

### Deploy this sample as Storage Account and Azure Function

#### Prerequisites:

-[dotnet6 SDK] (https://dotnet.microsoft.com/en-us/download/dotnet/6.0)

or

- [Visual Studio] (https://visualstudio.microsoft.com/)

#### Setup the Infrastructure

`infra/azure`

### Deploy as Azure Static WebApp

- Create your Azure Resources `infra/swa`
- Push this SourceCode to your Repo
- You find a Sample-Pipeline for Azure DevOps and also for Github in this  Sample root folder.

#### Azure DevOps

Use the azure-devops-static-webapp.yaml

- Parameter: DeploymentToken
- How to Setup

#### Github Action

Use the ???TODO??.yaml

- Parameter: DeploymentToken
- How to Setup

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|July 3, 2023| [Peter Paul Kirschner](https://github.com/petkir) |Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## References

- [Teams Toolkit Documentations](https://docs.microsoft.com/microsoftteams/platform/toolkit/teams-toolkit-fundamentals)
- [Teams Toolkit CLI](https://docs.microsoft.com/microsoftteams/platform/toolkit/teamsfx-cli)
- [TeamsFx SDK](https://docs.microsoft.com/microsoftteams/platform/toolkit/teamsfx-sdk)
- [Teams Toolkit Samples](https://github.com/OfficeDev/TeamsFx-Samples)
