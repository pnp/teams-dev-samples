import * as React from 'react';
import useGroupMemberships from '../../../../../hooks/UseGroupMemberships';
import { Link, Persona, PersonaSize, Shimmer, ShimmerElementType, ShimmerElementsGroup, Text } from '@fluentui/react';

export interface IGroupMembershipsProps {
    UserId: string;
}

export const GroupMemberships: React.FunctionComponent<IGroupMembershipsProps> = (props: React.PropsWithChildren<IGroupMembershipsProps>) => {
    const { isLoading, value } = useGroupMemberships(props.UserId);
    const wrapperStyles = { display: 'flex' };
    return (
        <div>
            <Text variant='xLarge'>Groups</Text>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 10 }}>
                {value.map((group) => { return <Link href={`https://entra.microsoft.com/#view/Microsoft_AAD_IAM/GroupDetailsMenuBlade/~/Overview/groupId/${group.id}`} target='_blank'><Persona text={group.displayName} size={PersonaSize.size40} /> </Link> })}
                {isLoading && [...Array(2)].map((e, i) => {
                    return <div style={wrapperStyles}>
                        <Shimmer
                            shimmerElements={[
                                { type: ShimmerElementType.circle, height: 40 },
                                { type: ShimmerElementType.gap, width: 16, height: 40 },
                                { type: ShimmerElementType.line, width: 100, height: 15 },
                            ]}
                        />
                    </div>
                })}
            </div>
            {!isLoading && value.length == 0 && <Text>No group memberships.</Text>}
        </div>
    );
};