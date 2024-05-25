

/**
 * Checks if a user is following an item.
 * @param arrUsers - An array of user IDs.
 * @param userId - The ID of the user to check.
 * @returns A boolean indicating whether the user is following the item.
 */
export function checkIsFollowing(arrUsers: string[], userId: string): boolean {

    if (arrUsers && userId) {

        if(arrUsers.length > 0 && userId.length > 0 && arrUsers.includes(userId)) {
            return true;
        }
    }

    return false;
}
