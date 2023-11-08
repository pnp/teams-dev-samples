// Initialize dotenv, to use .env file settings if existing
require("dotenv").config();
graphSvc = require('./graphService');
azSvc = require('./azureService');

const main = async () => {
    const userPrincipalName = process.env.MEETING_OWNER;
    const dummyAttendee = process.env.MEETING_ATTENDEE;

    const meetingSubject = "Test Meeting with App / Tab Node 2";

    const customerName = "Contoso";
    const customerEmail = "info@contoso.com";
    const customerPhone = "+491515445556";
    const customerId = "47110815";

    console.log(`Creating meeting with Owner ${userPrincipalName} nad Subject ${meetingSubject}`);
    const graphClient = graphSvc.getGraphClient();
    const userId = await graphSvc.getUserId(graphClient, userPrincipalName);
    console.log(userId);
    const joinUrl = await graphSvc.createEvent(graphClient, meetingSubject, userPrincipalName, userId, dummyAttendee);
    const chatId = await graphSvc.getMeetingChatId(graphClient, userId, joinUrl)    
    console.log(chatId);
    const appId = await graphSvc.getAppId(graphClient);
    console.log(appId);
    await graphSvc.installAppInChat(graphClient, appId, chatId);
    await graphSvc.installTabInChat(graphClient, appId, chatId, customerId);
    const customer = {
        Name: customerName,
        Phone: customerPhone,
        Email: customerEmail,
        Id: customerId
    }
    azSvc.saveAppConfig(chatId, customer);
    await azSvc.createCustomer(chatId, customer);
    const checkCustomer = await azSvc.getCustomer(customerId, chatId);
    console.log('Customer created in Azure Table');
    console.log(checkCustomer);
};

main();

