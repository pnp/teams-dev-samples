import { ExternalUserState } from "../enums/ExternalUserState";

export interface IUser {
    accountEnabled: boolean;
    id: string;
    displayName: string;
    givenName: string;
    surname: string;
    createdDateTime: Date;
    externalUserState: ExternalUserState;
    mail: string;
    userPrincipalName: string;
    externalUserStateChangeDateTime: Date;
    lastPasswordChangeDateTime: Date;
    officeLocation: string;
    businessPhones: string[];
    jobTitle: string;
    department: string;
    faxNumber: string;
    mobilePhone: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    signInActivity?: {
        lastSignInDateTime: Date;
        lastNonInteractiveSignInDateTime: Date;
    }
    _lastSignInTime?: Date;
}

export const IUserSelects = ["accountEnabled", "id", "displayName", "createdDateTime", "externalUserState", "mail", "userPrincipalName", "signInActivity", "externalUserStateChangeDateTime", "lastPasswordChangeDateTime", "officeLocation", "givenName", "surname","businessPhones","city", "jobTitle", "department", "faxNumber", "mobilePhone", "streetAddress", "state", "postalCode", "country"]
