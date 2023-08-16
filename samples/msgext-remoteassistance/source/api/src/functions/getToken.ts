import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CommunicationIdentityClient } from "@azure/communication-identity";

export async function getToken(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const identityClient = new CommunicationIdentityClient(process.env.ACS_CONNECTION_STRING);
    const user = await identityClient.createUser();
    const token = await identityClient.getToken(user, ["voip"]);

    return {
        jsonBody: {
            userId: user.communicationUserId,
            ...token
        }
    };
};

app.http('getToken', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getToken,
    route: 'token'
});
