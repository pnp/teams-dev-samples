import { ErrorWithCode } from "@microsoft/teamsfx";

import { loginAction } from "./Login";
import { TeamsUserCredentialContext } from "./TeamsUserCredentialContext";

export async function addNewScope(addscopes: string[]) {
    let credential = TeamsUserCredentialContext.getInstance().getCredential();
    try {
        await credential.getToken(addscopes);
    } catch (e) {
        try {
            if (e instanceof ErrorWithCode) await loginAction(addscopes);
        } catch (e) {
            console.log(e);
            throw new Error("Error: Add New Scope Failed.");
        }
    }
}
