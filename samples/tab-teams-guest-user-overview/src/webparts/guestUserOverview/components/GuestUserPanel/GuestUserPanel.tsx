import { ActionButton, IPanel, IPersonaProps, IRefObject, Label, MessageBar, MessageBarType, Panel, PanelType, Persona, PersonaSize, Pivot, PivotItem, Spinner, SpinnerSize, Stack, StackItem, Text } from '@fluentui/react';
import * as React from 'react';
import useUser from '../../../../hooks/UseUser';
import { ExternalUserState } from '../../../../enums/ExternalUserState';
import { InvitationResender } from './NoInvitationAccepted/InvitationResender';
import { ApplicationContext } from '../../../../util/ApplicationContext';
import { GroupMemberships } from './GroupMemberships/GroupMemberships';
import { RecentSignIns } from './RecentSignIns/RecentSignIns';
import { PrettyDate } from './PrettyDate/PrettyDate';
import { UserDetails } from './UserInformation/UserDetails';
import { CacheAction } from '../../../../providers/CacheManager';
import { useBoolean } from '@fluentui/react-hooks';
import { DeleteUser } from './UserInformation/DeleteUser';


export interface IGuestUserPanelProps {
    UserId: string;
    OnClose: () => void;
}

export const GuestUserPanel: React.FunctionComponent<IGuestUserPanelProps> = (props: React.PropsWithChildren<IGuestUserPanelProps>) => {
    const { user, isLoading, pendingAction, reload } = useUser(props.UserId);
    const { GraphProvider, Storage } = React.useContext(ApplicationContext);
    const [isDeletePanelOpen, { setTrue: showDeletePanel, setFalse: hideDeletePanel }] = useBoolean(false);

    function _onRenderTertiaryText(personaProps: IPersonaProps): JSX.Element {
        return (
            <div style={{ display: 'flex', marginLeft: '-10px' }}>
                <ActionButton iconProps={{ iconName: user.accountEnabled ? "Contact" : "BlockContact" }}
                    text={user.accountEnabled ? "Block user" : "Unblock user"}
                    onClick={async () => {
                        GraphProvider.SetAccountStateForUserById(user.id, !user.accountEnabled);
                        user.accountEnabled ? Storage.BlockUser(user.id) : Storage.UnBlockUser(user.id);
                        reload();
                    }}
                />
                <ActionButton iconProps={{ iconName: "Delete" }} text='Delete user' disabled={user.accountEnabled} onClick={showDeletePanel} />
                <ActionButton iconProps={{ iconName: "NavigateExternalInline" }} text='Open in Entra' target='_blank' href={`https://entra.microsoft.com/#view/Microsoft_AAD_UsersAndTenants/UserProfileMenuBlade/~/overview/userId/${user.id}`} />
            </div>);
    }

    return (
        <Panel
            isOpen={props.UserId != null}
            onDismiss={() => props.OnClose()}
            onDismissed={() => props.OnClose()}
            type={PanelType.medium}
        >

            {isLoading && <Spinner size={SpinnerSize.large} label={"Loading..."} />}

            {!isLoading &&
                <>
                    <Stack tokens={{ childrenGap: 25 }}>
                        {user.externalUserState == ExternalUserState.PendingAcceptance &&
                            <InvitationResender UserId={user.id} />
                        }

                        {user.accountEnabled === false && <MessageBar messageBarType={MessageBarType.error}>This user is blocked from sign in!</MessageBar>}
                        {pendingAction === CacheAction.BlockUser && user.accountEnabled === true && <MessageBar messageBarType={MessageBarType.error}>You've initiated a block of this user, it might take a few minutes</MessageBar>}
                        {pendingAction === CacheAction.UnblockUser && user.accountEnabled === false && <MessageBar messageBarType={MessageBarType.success}>You've initiated an unblock of this user, it might take a few minutes</MessageBar>}
                        {pendingAction === CacheAction.DeleteUser && <MessageBar messageBarType={MessageBarType.error}>You've initiated an deletion of this user, it might take a few minutes</MessageBar>}

                        <Persona text={user.displayName} secondaryText={user.mail} onRenderTertiaryText={_onRenderTertiaryText} size={PersonaSize.size72} />

                        <Pivot aria-label="Pivot" >
                            <PivotItem headerText="General" headerButtonProps={{ 'data-order': 1, 'data-title': 'General' }}>
                                <Stack tokens={{ childrenGap: 25 }} styles={{ root: { marginTop: 15 } }}>


                                    <div style={{ display: 'grid', gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
                                        <PrettyDate date={user.createdDateTime} label='User Created' />
                                        <PrettyDate date={user.externalUserStateChangeDateTime} label='Invitation Accepted' override={user.externalUserState == ExternalUserState.Accepted ? null : "Not yet accepted"} />
                                        <PrettyDate date={user._lastSignInTime} label='Last sign-in' />
                                        <PrettyDate date={user.lastPasswordChangeDateTime} label='Last password change' />
                                    </div>

                                    <GroupMemberships UserId={user.id} />

                                    <RecentSignIns UserId={user.id} />

                                </Stack>
                            </PivotItem>
                            <PivotItem headerText="Contact information" headerButtonProps={{ 'data-order': 2, 'data-title': 'Contact information' }}>
                                <Stack style={{ marginTop: 15 }}>
                                    <UserDetails UserId={user.id} />
                                </Stack>
                            </PivotItem>
                        </Pivot>
                        {
                            isDeletePanelOpen &&
                            <DeleteUser User={user} isOpen={isDeletePanelOpen} onDismiss={async () => { hideDeletePanel(); reload(); }} />
                        }
                    </Stack>
                </>}

        </Panel>
    );
};