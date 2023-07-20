import * as React from 'react';
import useSignIns from '../../../../../hooks/UseSignIns';
import { DetailsList, IColumn, SelectionMode, ShimmeredDetailsList, Text } from '@fluentui/react';
import { DefaultColumnn } from '../../../../../util/TableHelpers';
import { ISignInEntry } from '../../../../../models/ISignInEntry';

export interface IRecentSignInsProps {
    UserId: string;
}

const columns: IColumn[] = [
    {
        ...DefaultColumnn('createdDateTime'),
        name: 'Time',
        onRender: (item: ISignInEntry) => item.createdDateTime.toLocaleString(),
    },
    {
        ...DefaultColumnn('status'),
        name: 'Status',
        minWidth: 50,
        onRender: (item: ISignInEntry) => item.status.errorCode == 0 ? "Ok" : item.status.failureReason,

    },
    {
        ...DefaultColumnn('riskState'),
        name: 'Risk state',
        minWidth: 65,

    },
    {
        ...DefaultColumnn('location'),
        name: 'Location',
        onRender: (item: ISignInEntry) => `${item.location.city}, ${item.location.state} - ${item.location.countryOrRegion}`,
    },
    {
        ...DefaultColumnn('ipAddress'),
        name: 'IP Address'
    }
]

export const RecentSignIns: React.FunctionComponent<IRecentSignInsProps> = (props: React.PropsWithChildren<IRecentSignInsProps>) => {
    const { isLoading, value } = useSignIns(props.UserId);

    return (
        <div>
            <Text variant='xLarge'>Sign-in activity</Text>
            {(isLoading || (value.length > 0)) &&
                <ShimmeredDetailsList
                    compact
                    items={value}
                    enableShimmer={isLoading}
                    selectionMode={SelectionMode.none}
                    columns={columns}
                />
            }

            {!isLoading && value.length == 0 && <div><Text>No sign in activity</Text></div>}
        </div>
    );
};



