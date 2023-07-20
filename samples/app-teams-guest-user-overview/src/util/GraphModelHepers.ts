import { IGuestUser } from "../models/IGuestUser";
import { IUser } from "../models/IUser";


export const ParseIUser: (user: IGuestUser | IUser) => IGuestUser = (user: IGuestUser | IUser) => {
    user.createdDateTime = new Date(user.createdDateTime as any as string);
    if (user.signInActivity != null) {
        let date: Date;
        if (user.signInActivity.lastSignInDateTime != null) {
            user.signInActivity.lastSignInDateTime = new Date(user.signInActivity.lastSignInDateTime as any as string);
            date = user.signInActivity.lastSignInDateTime;
        }
        if (user.signInActivity.lastNonInteractiveSignInDateTime != null) {
            user.signInActivity.lastNonInteractiveSignInDateTime = new Date(user.signInActivity.lastNonInteractiveSignInDateTime as any as string);
            if (date == null) { date = user.signInActivity.lastNonInteractiveSignInDateTime; }
            if (date != null && user.signInActivity.lastNonInteractiveSignInDateTime > date) { date = user.signInActivity.lastNonInteractiveSignInDateTime; }
        }
        
        user._lastSignInTime = date;

    }

    if (user.externalUserStateChangeDateTime != null)
        user.externalUserStateChangeDateTime = new Date(user.externalUserStateChangeDateTime as any as string);

    if (user.lastPasswordChangeDateTime != null)
        user.lastPasswordChangeDateTime = new Date(user.lastPasswordChangeDateTime as any as string);
    return user;
}
export const ParseIUsers: (users: IGuestUser[] | IUser[]) => IGuestUser[] | IUser[] = (users: IGuestUser[] | IUser[]) => { return users.map(ParseIUser) };