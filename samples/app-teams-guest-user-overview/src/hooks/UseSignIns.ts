import * as React from 'react';
import { useState, useEffect } from 'react';
import { ISignInEntry } from '../models/ISignInEntry';
import { ApplicationContext } from '../util/ApplicationContext';

export default function useSignIns(UserId: string) {
    const [value, setValue] = useState<ISignInEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { GraphProvider } = React.useContext(ApplicationContext);

    useEffect(() => {
        async function fetchData() {
            setValue([]);
            if (UserId != null) {
                setIsLoading(true);
                const signIns = await GraphProvider.GetSignInHistoryByUserId(UserId);
                setValue(signIns);
                setIsLoading(false);
            }
        }

        fetchData();
    }, [UserId]);

    return {
        value, isLoading
    };
}