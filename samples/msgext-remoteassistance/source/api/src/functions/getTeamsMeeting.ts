import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosDB } from "../modules/Cosmos";

export async function getTeamsMeeting(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    const joinMeetingId = request.params.joinMeetingId;
    if (!joinMeetingId) {
        return {
            status: 400,
            jsonBody: "Missing joinMeetingId"
        };
    }

    const cosmos = new CosmosDB(process.env.COSMOS_DB_ENDPOINT, process.env.COSMOS_DB_KEY);
    await cosmos.init();
    const meeting = await cosmos.getTeamsMeetingByMeetingJoinId(joinMeetingId);
    if (!meeting) {
        return {
            status: 404,
            jsonBody: "Meeting not found"
        };
    }

    return {
        jsonBody: {
            joinMeetingId: meeting.joinMeetingIdSettings.joinMeetingId,
            joinWebUrl: meeting.joinWebUrl
        }
    };
};

app.http('getTeamsMeeting', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getTeamsMeeting,
    route: 'teamsMeeting/{joinMeetingId}'
});