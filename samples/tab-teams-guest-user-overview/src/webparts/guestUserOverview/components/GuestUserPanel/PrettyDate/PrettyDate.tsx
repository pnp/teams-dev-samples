import { DirectionalHint, Stack, Text, TooltipHost } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import * as React from 'react';
import { PrettyPrintDate, datediff } from '../../../../../util/DateHelpers';

export interface IPrettyDateProps {
    date: Date;
    label?: string;
    override?: string;
}

export const PrettyDate: React.FunctionComponent<IPrettyDateProps> = (props: React.PropsWithChildren<IPrettyDateProps>) => {
    const tooltipId = useId('tooltip');
    const days = props.date ? datediff(props.date, new Date()) : null;


    return (
        <>

            <TooltipHost
                content={props.date && props.override == null ? props.date.toLocaleString() : "N/A"}
                id={tooltipId}
                calloutProps={{ gapSpace: 0 }}
                directionalHint={DirectionalHint.topLeftEdge}

            >
                <Stack>
                    {props.label != null && <Text style={{ fontWeight: 'bold' }}>{props.label}</Text>}
                    {props.override && <Text>{props.override}</Text>}
                    {props.override == null &&
                        <>
                            {days == null && <Text>N/A</Text>}
                            {days != null && <Text>{PrettyPrintDate(days)}</Text>}
                        </>
                    }
                </Stack>
            </TooltipHost >
        </>
    );
};