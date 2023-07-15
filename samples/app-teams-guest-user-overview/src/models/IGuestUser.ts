import { ExternalUserState } from "../enums/ExternalUserState";


export interface IGuestUser {
    accountEnabled: boolean;
    id: string;
    displayName: string;
    createdDateTime: Date;
    externalUserState: ExternalUserState;
    mail: string;
    userPrincipalName: string;
    externalUserStateChangeDateTime: Date;
    lastPasswordChangeDateTime: Date;
    signInActivity?: {
        lastSignInDateTime: Date;
        lastNonInteractiveSignInDateTime: Date;
    }
    _lastSignInTime?: Date;

}

export const IGuestUserSelects = ["accountEnabled", "id", "displayName", "createdDateTime", "externalUserState", "mail", "userPrincipalName", "signInActivity", "externalUserStateChangeDateTime", "lastPasswordChangeDateTime"]
