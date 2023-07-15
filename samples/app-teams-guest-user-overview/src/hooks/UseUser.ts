import * as React from 'react';
import { useState, useEffect } from 'react';
import { IUser, IUserSelects } from '../models/IUser';
import { ApplicationContext } from '../util/ApplicationContext';
import { CacheAction } from '../providers/CacheManager';

export default function useUser(UserId: string) {
    const [user, setUser] = useState<IUser>(null);
    const [curMessage, setCurMessage] = useState<CacheAction>();
    const { GraphProvider, Storage } = React.useContext(ApplicationContext);

    async function fetchData() {
        const user = await GraphProvider.GetUserById(UserId);
        setCurMessage(Storage.GetUserState(UserId));
        setUser(user);
    }

    useEffect(() => {
        if (UserId != null) {
            fetchData();
        } else {
            setUser(null);
            setCurMessage(null);
        }
    }, [UserId]);

    return {
        user, isLoading: user == null, reload: () => fetchData(), pendingAction: curMessage
    };
}