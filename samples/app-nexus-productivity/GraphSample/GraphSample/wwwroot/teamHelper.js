import 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';

// Ensure that the Teams SDK is initialized once no matter how often this is called
let teamsInitPromise;
export function ensureTeamsSdkInitialized() {
    if (!teamsInitPromise) {
        teamsInitPromise = microsoftTeams.app.initialize();
    }
    return teamsInitPromise;
}

// Function returns a promise which resolves to true if we're running in Teams
export async function inTeams() {
    try {
        await ensureTeamsSdkInitialized();
        const context = await microsoftTeams.app.getContext();
        return (context.app.host.name === microsoftTeams.HostName.teams);
    }
    catch (e) {
        console.log(`${e} from Teams SDK, may be running outside of Teams`);
        return false;
    }
}