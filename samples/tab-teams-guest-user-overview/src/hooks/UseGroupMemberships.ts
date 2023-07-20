import * as React from 'react';
import { useState, useEffect } from 'react';
import { IGroup } from '../models/IGroup';
import { ApplicationContext } from '../util/ApplicationContext';

export default function useGroupMemberships(userId: string) {
    const [value, setValue] = useState<IGroup[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { GraphProvider } = React.useContext(ApplicationContext);


    useEffect(() => {
        async function fetchData() {
            setValue([]);
            if (userId != null) {
                setIsLoading(true);
                const result = await GraphProvider.GetGroupMembershipsByUserId(userId, (partial) => setValue(partial));
                setValue(result);
                setIsLoading(false);
            }
        }

        fetchData();
    }, [userId]);

    return {
        value, isLoading
    };
}