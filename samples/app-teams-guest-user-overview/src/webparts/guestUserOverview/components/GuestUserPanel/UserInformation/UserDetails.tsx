import * as React from "react";
import useSignIns from "../../../../../hooks/UseSignIns";
import { ActionButton, DetailsList, IColumn, Label, Link, SelectionMode, ShimmeredDetailsList, Spinner, SpinnerSize, Stack, Text } from '@fluentui/react';
import useUser from "../../../../../hooks/UseUser";
import { useBoolean } from "@fluentui/react-hooks";
import { UpdateUserDetails } from "./UpdateUserDetails";
import { ApplicationContext } from "../../../../../util/ApplicationContext";
import { useState } from "react";

export interface IUserDetailsProps {
    UserId: string;
}

export const UserDetails: React.FunctionComponent<IUserDetailsProps> = (props: React.PropsWithChildren<IUserDetailsProps>) => {
    const { isLoading, user, reload } = useUser(props.UserId);
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
    
    const firstName = user?.displayName?.split(' ')[0];
    const lastName = user?.displayName?.replace(firstName, '')?.trim();
    const organization = user?.mail?.split('@')[1]?.split('.')[0];

    const _onDismiss = () => {
        dismissPanel();
        reload(); // Wont reload?
    }

    return (
        <div>
            {isLoading &&
                <>
                    <Spinner size={SpinnerSize.large} label="Loading..."/>
                </>
            }

            {(!isLoading || (user != null)) &&
                <div style={{ display: 'grid', gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
                    <Stack>
                        <Text style={{ fontWeight: 'bold' }}>Display name</Text>
                        <Text>{user.displayName}</Text>
                    </Stack>
                    <Stack>
                        <Text style={{ fontWeight: 'bold' }}>Organization</Text>
                        <Text>{user.officeLocation ?? organization}</Text>
                    </Stack>
                    <Stack>
                        <Text style={{ fontWeight: 'bold' }}>First name</Text>
                        <Text>{user.givenName ?? firstName}</Text>
                    </Stack>
                    <Stack>
                        <Text style={{ fontWeight: 'bold' }}>Last name</Text>
                        <Text>{user.surname ?? lastName}</Text>
                    </Stack>
                    <Stack>
                        <Text style={{ fontWeight: 'bold' }}>Job title</Text>
                        <Text>{user?.jobTitle ?? 'N/A'}</Text>
                    </Stack>
                    <Stack>
                        <Text style={{ fontWeight: 'bold' }}>Department</Text>
                        <Text>{user?.department ?? 'N/A'}</Text>
                    </Stack>
                    <Stack>
                        <Text style={{ fontWeight: 'bold' }}>Office phone</Text>
                        <Text>{user?.businessPhones[0] ?? 'N/A'}</Text>
                    </Stack>
                    <Stack>
                        <Text style={{ fontWeight: 'bold' }}>Fax number</Text>
                        <Text>{user?.faxNumber ?? 'N/A'}</Text>
                    </Stack>
                    <Stack>
                        <Text style={{ fontWeight: 'bold' }}>Mobile phone</Text>
                        <Text>{user?.mobilePhone ?? 'N/A'}</Text>
                    </Stack>
                    <Stack>
                        <Text style={{ fontWeight: 'bold' }}>Street address</Text>
                        <Text>{user?.streetAddress ?? 'N/A'}</Text>
                    </Stack>
                    <Stack>
                        <Text style={{ fontWeight: 'bold' }}>City</Text>
                        <Text>{user?.city ?? 'N/A'}</Text>
                    </Stack>
                    <Stack>
                        <Text style={{ fontWeight: 'bold' }}>State or province</Text>
                        <Text>{user?.state ?? 'N/A'}</Text>
                    </Stack>
                    <Stack>
                        <Text style={{ fontWeight: 'bold' }}>Zip or postal code</Text>
                        <Text>{user?.postalCode ?? 'N/A'}</Text>
                    </Stack>
                    <Stack>
                        <Text style={{ fontWeight: 'bold' }}>Country or region</Text>
                        <Text>{user?.country ?? 'N/A'}</Text>
                    </Stack>
                    <Link style={{ padding: 0 }} onClick={openPanel}> Manage contact information </Link>
                </div>
            }
            {
                isOpen &&
                <UpdateUserDetails isOpen={isOpen} onDismiss={_onDismiss} User={user} />
            }
        </div>
    );
};