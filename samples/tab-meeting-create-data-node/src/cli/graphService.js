//graphService.js:
require("dotenv").config();
const azure = require('@azure/identity');
const authProviders = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');
const graph = require('@microsoft/microsoft-graph-client');

function getGraphClient () {
    // @azure/identity
    credential = new azure.ClientSecretCredential(
        process.env.TENANT_ID,
        process.env.TAB_APP_ID,
        process.env.TAB_APP_SECRET
    );
    
    // @microsoft/microsoft-graph-client/authProviders/azureTokenCredentials
    authProvider = new authProviders.TokenCredentialAuthenticationProvider(credential, {
        // The client credentials flow requires that you request the
        // /.default scope, and pre-configure your permissions on the
        // app registration in Azure. An administrator must grant consent
        // to those permissions beforehand.
        scopes: ['https://graph.microsoft.com/.default']
    });    

    const graphClient = graph.Client.initWithMiddleware({ authProvider: authProvider });

    // credential.getToken([
    //     'https://graph.microsoft.com/.default'
    // ]).then(result => {
    //     console.log(`Àccess Token: ${result.token}`);
    // });
    return graphClient;
}

async function getUserId (client, upn) {
    const user = await client.api(`/users/${upn}`)
	.get();
    return user.id;
}

async function createEvent (client, meetingSubject, userPrincipalName, userID, dummyAttendee) {
    const startDate = new Date();
    const endDate = new Date(startDate);
    const startHours = startDate.getHours();
    endDate.setHours(startHours + 1);
    console.log(startDate.toISOString());
    console.log(endDate.toISOString());
    const event = {
        subject: meetingSubject,
        isOnlineMeeting: true,
        start: {
            dateTime: startDate.toISOString(),
            timeZone: 'Europe/Berlin'
        },
        end: {
            dateTime: endDate.toISOString(),
            timeZone: 'Europe/Berlin'
        },
        Organizer :
            {
                emailAddress: { address: userPrincipalName }
            }, 
        attendees: [
        {
            emailAddress: {
            address: dummyAttendee
            },
            type: 'required'
        }
        ]
    };
    
    const result = await client.api(`/users/${userID}/events`)
        .post(event);
    return result.onlineMeeting.joinUrl;
}

async function getMeetingChatId (client, userID, joinUrl) {
    const onlineMeeting = await client.api(`/users/${userID}/onlineMeetings`)
        .filter(`joinWebUrl eq '${joinUrl}'`)
        .get();    
    const chatId = onlineMeeting.value[0].chatInfo.threadId;
    console.log(`OnlineMeeting with ChatID ${chatId}`);
    return chatId;
}

async function getAppId (client) {
    const apps = await client.api('/appCatalogs/teamsApps')                
                .filter("distributionMethod eq 'organization' and displayName eq 'Teams Meeting Custom Data'")
                .get();

    let appId = "";
    console.log(apps);
    console.log(apps.value);
    appId = apps.value[0].id;

    return appId;
}

async function installAppInChat (client, appId, chatId) {
    const requestBody =
    {
        "teamsApp@odata.bind": `https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/${appId}`
    };
    await client.api(`/chats/${chatId}/installedApps`)
            .post(requestBody);
    return true;
}

async function installTabInChat(client, appId, chatId, customerId) {
    const teamsTab = {
        displayName: 'Custom Data',
        'teamsApp@odata.bind': `https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/${appId}`,
        configuration: {
            entityId: customerId,
            contentUrl: `https://${process.env.PUBLIC_HOSTNAME}/meetingDataTab/?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}`,
            removeUrl: `https://${process.env.PUBLIC_HOSTNAME}/meetingDataTab/remove.html?theme={theme}`,
            websiteUrl: `https://${process.env.PUBLIC_HOSTNAME}/meetingDataTab/?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}`
        }
      };
      
      await client.api(`/chats/${chatId}/tabs`)
          .post(teamsTab);
}

exports.getGraphClient = getGraphClient;
exports.getUserId = getUserId;
exports.createEvent = createEvent;
exports.getMeetingChatId = getMeetingChatId;
exports.getAppId = getAppId;
exports.installAppInChat = installAppInChat;
exports.installTabInChat = installTabInChat;