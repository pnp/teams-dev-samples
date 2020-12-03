import * as React from "react";
import { Provider, Flex, Loader, FilesPdfColoredIcon, RedoIcon } from "@fluentui/react-northstar";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import Axios from "axios";
import Utilities from "../../api/Utilities";
/**
 * State for the pdfUploaderTabTab React component
 */
export interface IPdfUploaderTabState extends ITeamsBaseComponentState {
    entityId?: string;
    name?: string;
    error?: string;
    token: string;
    highlight: boolean;
    siteDomain: string;
    sitePath: string;
    channelName: string;
    status: string;
    uploadUrl: string;
}

/**
 * Properties for the pdfUploaderTabTab React component
 */
export interface IPdfUploaderTabProps {

}
/**
 * Implementation of the PDF Uploader content page
 */
export class PdfUploaderTab extends TeamsBaseComponent<IPdfUploaderTabProps, IPdfUploaderTabState> {

    public async componentWillMount() {
        this.updateTheme(this.getQueryVariable("theme"));


        microsoftTeams.initialize(() => {
            microsoftTeams.registerOnThemeChangeHandler(this.updateTheme);
            microsoftTeams.getContext((context) => {
                this.setState({
                    entityId: context.entityId,
                    siteDomain: context.teamSiteDomain!, // Non-null assertion operator...
                    sitePath: context.teamSitePath!,
                    channelName: context.channelName!
                });
                this.updateTheme(context.theme);
                microsoftTeams.authentication.getAuthToken({
                    successCallback: (token: string) => {
                        this.setState({ token: token });
                        microsoftTeams.appInitialization.notifySuccess();
                    },
                    failureCallback: (message: string) => {
                        this.setState({ error: message });
                        microsoftTeams.appInitialization.notifyFailure({
                            reason: microsoftTeams.appInitialization.FailedReason.AuthFailed,
                            message
                        });
                    },
                    resources: [process.env.PDFUPLOADER_APP_URI as string]
                });
            });
        });
    }

    private allowDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy';
    }
    private enableHighlight = (event) => {
        this.allowDrop(event);
        this.setState({
            highlight: true
        });
    }
    private disableHighlight = (event) => {
        this.allowDrop(event);
        this.setState({
            highlight: false
        });
    }
    private dropFile = (event) => {
        this.allowDrop(event);
        const dt = event.dataTransfer;
        const files =  Array.prototype.slice.call(dt.files); // [...dt.files];
        files.forEach(fileToUpload => {
            if (Utilities.validFileExtension(fileToUpload.name)) {
                this.uploadFile(fileToUpload);
            }
        });
    }
    private uploadFile = (fileToUpload: File) => {
        this.setState({
            status: 'running',
            uploadUrl: ''
        });
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('domain', this.state.siteDomain);
        formData.append('sitepath', this.state.sitePath);
        formData.append('channelname', this.state.channelName);
        Axios.post(`https://${process.env.HOSTNAME}/api/upload`, formData, {
                            headers: {
                                'Authorization': `Bearer ${this.state.token}`,
                                'content-type': 'multipart/form-data'
                            }
                        }).then(result => {
                            console.log(result);
                            this.setState({
                                status: 'uploaded',
                                uploadUrl: result.data
                            });
                        });
    }
    private reset = () => {
        this.setState({
            status: '',
            uploadUrl: ''
        });
    }
    /**
     * The render() method to create the UI of the tab
     */
    public render() {
        return (
            <Provider theme={this.state.theme}>
                <Flex>
                    <div className='dropZoneBG'>
                        Drag your file here:
                        <div className={ `dropZone ${this.state.highlight ? 'dropZoneHighlight' : ''}` }
                                onDragEnter={this.enableHighlight}
                                onDragLeave={this.disableHighlight}
                                onDragOver={this.allowDrop}
                                onDrop={this.dropFile}>

                            {this.state.status !== 'running' && this.state.status !== 'uploaded' &&
                            <div className='pdfLogo'>
                                <FilesPdfColoredIcon size="largest" bordered />
                            </div>}
                            {this.state.status === 'running' &&
                            <div className='loader'>
                                <Loader label="Upload and conversion running..." size="large" labelPosition="below" inline />
                            </div>}
                            {this.state.status === 'uploaded' && 
                            <div className='result'>File uploaded to target and available <a href={this.state.uploadUrl}>here.</a>
                            <RedoIcon size="medium" bordered onClick={this.reset} title="Reset" /></div>}
                        </div>
                    </div>
                </Flex>
            </Provider>
        );
    }
}
