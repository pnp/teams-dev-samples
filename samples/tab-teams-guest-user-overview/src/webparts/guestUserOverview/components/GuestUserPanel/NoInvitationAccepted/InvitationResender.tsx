import { ITextField, IconButton, MessageBar, MessageBarButton, MessageBarType, Spinner, SpinnerSize, TextField } from '@fluentui/react';
import * as React from 'react';
import { ApplicationContext } from '../../../../../util/ApplicationContext';

export interface InvitationResenderProps {
    UserId: string;
}

enum ResendState {
    NotSent,
    Sending,
    Sent,
}

export const InvitationResender: React.FunctionComponent<InvitationResenderProps> = (props: React.PropsWithChildren<InvitationResenderProps>) => {
    const [step, setStep] = React.useState<ResendState>(ResendState.NotSent);
    const [url, setUrl] = React.useState<string>(null);
    const { GraphProvider } = React.useContext(ApplicationContext);
    const Ref = React.useRef<ITextField>(null)

    const sendInvite = async () => {
        setStep(ResendState.Sending);
        const InviteUrl = await GraphProvider.ResendInvitationByUserId(props.UserId);
        setUrl(InviteUrl);
        setStep(ResendState.Sent);
    }

    return (
        <>
            {step == ResendState.NotSent &&
                <MessageBar messageBarType={MessageBarType.warning} actions={
                    <div>
                        <MessageBarButton text='Regenerate invite link' onClick={() => sendInvite()} />
                    </div>
                }>
                    The selected user has <b>NOT</b> yet accepted their invitation.
                </MessageBar>
            }

            {step == ResendState.Sending &&
                <MessageBar messageBarType={MessageBarType.info}>
                    <div style={{ display: 'flex' }}>
                        <Spinner size={SpinnerSize.xSmall} />&nbsp;<span>Generating invite url...</span>
                    </div>
                </MessageBar>
            }

            {step == ResendState.Sent &&
                <MessageBar messageBarType={MessageBarType.success} styles={{ innerText: { width: "100%" } }}>
                    <div>
                        A new invitation has been created, copy the URL and share with the user!
                        <div style={{ display: 'flex' }}>
                            <TextField value={url} readOnly componentRef={Ref} styles={{ root: { flexGrow: 2 } }} />
                            <IconButton iconProps={{ iconName: "Copy" }} onClick={() => {
                                Ref.current.select();
                                document.execCommand('copy');
                            }} />
                        </div>
                    </div>
                </MessageBar>
            }
        </>
    );
};