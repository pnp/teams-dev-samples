import * as React from "react";
import useSignIns from "../../../../../hooks/UseSignIns";
import { ActionButton, DefaultButton, DetailsList, Dropdown, IColumn, IDropdownOption, Icon, Label, Link, Panel, PanelType, PrimaryButton, SelectionMode, ShimmeredDetailsList, Spinner, SpinnerSize, Stack, Text, TextField } from '@fluentui/react';
import useUser from "../../../../../hooks/UseUser";
import { useBoolean } from "@fluentui/react-hooks";
import { useContext, useEffect, useState } from "react";
import { IUser } from "../../../../../models/IUser";
import { ApplicationContext } from "../../../../../util/ApplicationContext";
import { LanguageList } from "../../../../../enums/LanguageList";

export interface IUpdateUserDetailsProps {
    User: IUser;
    onDismiss: () => void;
    isOpen: boolean;
}

export const UpdateUserDetails: React.FunctionComponent<IUpdateUserDetailsProps> = (props: React.PropsWithChildren<IUpdateUserDetailsProps>) => {
    const [user, setUser] = useState<IUser>(props.User);
    const { GraphProvider } = useContext(ApplicationContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    useEffect(() => {
        const firstName = user?.givenName ?? user?.displayName?.split(' ')[0];
        const lastName = user?.surname ?? user?.displayName?.replace(firstName, '')?.trim();
        const organization = user?.officeLocation ?? user?.mail?.split('@')[1]?.split('.')[0];

        setUser((prev) => ({ ...prev, givenName: firstName, surname: lastName, officeLocation: organization }))
    }, []);

    const _updateUser = async () => {
        setIsLoading(true);
        await GraphProvider.UpdateIUser(user)
        let res = await GraphProvider.GetUserById(user.id);
        setUser((prev) => ({ ...prev, res }))
        setIsLoading(false);
    }

    function _onRenderFooterContent(): JSX.Element {
        return (
            <div>
                <PrimaryButton onClick={async () => await _updateUser()} style={{ marginRight: 8 }} disabled={isLoading}>
                    Save
                </PrimaryButton>
                <DefaultButton onClick={props.onDismiss}>Cancel</DefaultButton>
            </div>
        )
    }

    return (
        <Panel isOpen={props.isOpen} onDismiss={props.onDismiss} closeButtonAriaLabel="Close" type={PanelType.medium} onRenderFooterContent={_onRenderFooterContent} isFooterAtBottom={true}>

            {(user != null) &&
                <div style={{ display: 'grid', gap: 10 }}>
                    <h1>Manage contact information</h1>

                    {isLoading &&
                        <>
                            <Spinner size={SpinnerSize.large} label="Saving..." />
                        </>
                    }
                    {!isLoading &&
                        <>
                            <TextField label="First name" value={user?.givenName} onChange={(_, val) => setUser((prev) => ({ ...prev, givenName: val }))} />
                            <TextField label="Last name" value={user?.surname} onChange={(_, val) => setUser((prev) => ({ ...prev, surname: val }))} />
                            <TextField label="Display name" value={user?.displayName} onChange={(_, val) => setUser((prev) => ({ ...prev, displayName: val }))} />
                            <TextField label="Job title" value={user?.jobTitle} onChange={(_, val) => setUser((prev) => ({ ...prev, jobTitle: val }))} />
                            <TextField label="Department" value={user?.department} onChange={(_, val) => setUser((prev) => ({ ...prev, department: val }))} />
                            <TextField label="Office" value={user?.officeLocation} onChange={(_, val) => setUser((prev) => ({ ...prev, officeLocation: val }))} />
                            <div style={{ display: 'grid', gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
                                <TextField label="Office phone" value={user?.businessPhones[0]} onChange={(_, val) => setUser((prev) => ({ ...prev, businessPhones: [val] }))} />
                                <TextField label="Fax number" value={user?.faxNumber} onChange={(_, val) => setUser((prev) => ({ ...prev, faxNumber: val }))} />
                            </div>
                            <TextField label="Mobile phone" value={user?.mobilePhone} onChange={(_, val) => setUser((prev) => ({ ...prev, mobilePhone: val }))} />
                            <TextField label="Street address" value={user?.streetAddress} onChange={(_, val) => setUser((prev) => ({ ...prev, streetAddress: val }))} />
                            <div style={{ display: 'grid', gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
                                <TextField label="City" value={user?.city} onChange={(_, val) => setUser((prev) => ({ ...prev, city: val }))} />
                                <TextField label="State or province" value={user?.state} onChange={(_, val) => setUser((prev) => ({ ...prev, state: val }))} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
                                <TextField label="Zip or postal code" value={user?.postalCode} onChange={(_, val) => setUser((prev) => ({ ...prev, postalCode: val }))} />
                                <Dropdown
                                    placeholder="Select Country or region"
                                    label="Country or region"
                                    options={LanguageList}
                                    onChange={(_, option) => setUser((prev) => ({ ...prev, country: option.text }))}
                                    selectedKey={user?.country?.toLocaleLowerCase()}
                                />
                            </div>
                        </>
                    }
                </div >
            }
        </Panel >
    );
};