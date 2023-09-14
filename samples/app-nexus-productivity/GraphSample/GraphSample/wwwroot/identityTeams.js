import { ensureTeamsSdkInitialized, inTeams } from '/modules/teamsHelpers.js';
import 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';

async function getAccessToken(isInTeams) {
    if (await inTeams()) {
        isInTeams = true;
        await ensureTeamsSdkInitialized();
        const token = await microsoftTeams.authentication.getAuthToken();
        return { token, isInTeams: isInTeams };
    }
    return { token: null, isInTeams: isInTeams };
}