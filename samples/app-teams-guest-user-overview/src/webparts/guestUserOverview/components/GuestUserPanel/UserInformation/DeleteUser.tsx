import * as React from "react";
import { IUser } from "../../../../../models/IUser";
import { useContext } from "react";
import { ApplicationContext } from "../../../../../util/ApplicationContext";
import { DefaultButton, Panel, PanelType, PrimaryButton } from "@fluentui/react";

export interface IDeleteUser {
    User: IUser;
    onDismiss: () => void;
    isOpen: boolean;
}

export const DeleteUser: React.FunctionComponent<IDeleteUser> = (props: React.PropsWithChildren<IDeleteUser>) => {
    const { User, onDismiss } = props;
    const { GraphProvider, Storage } = useContext(ApplicationContext);


    function _deleteUser(): void {
        GraphProvider.DeleteUser(User);
        Storage.DeleteUser(User.id)
        onDismiss();
    }

    function _onRenderFooterContent(): JSX.Element {
        return (
            <div>
                <PrimaryButton style={{ marginRight: 8 }} onClick={_deleteUser}>
                    Delete
                </PrimaryButton>
                <DefaultButton onClick={props.onDismiss}>Cancel</DefaultButton>
            </div>
        )
    }

    return (
        <Panel isOpen={props.isOpen} onDismiss={props.onDismiss} closeButtonAriaLabel="Close" type={PanelType.medium} onRenderFooterContent={_onRenderFooterContent} isFooterAtBottom={true}>
            <h1>Delete {User.displayName}</h1>
            <b>Deleting a user</b>
            <p>Deleting will remove all the user's permissions and access. The user can be reinstated up to 30 days after deletion.</p>
        </Panel>
    );
}