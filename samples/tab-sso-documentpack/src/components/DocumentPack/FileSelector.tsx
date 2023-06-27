import { Card, List, Progress, Result } from "antd";
import { Icon } from '@fluentui/react/lib/Icon';
import { Dropzone, FileItem, FileMosaic } from "@dropzone-ui/react";
import { DefaultButton, IIconProps, PrimaryButton } from '@fluentui/react';
import { useContext, useEffect, useState } from "react";
import React from "react";
import './DocumentPack.css'
import { TeamsUserCredentialContext } from "../../helpers/AuthHelper/TeamsUserCredentialContext";
import config from "../../lib/config";
import { BearerTokenAuthProvider, createApiClient, createMicrosoftGraphClientWithCredential } from "@microsoft/teamsfx";
import { TeamsFxContext } from "../Context";
import { Client } from "@microsoft/microsoft-graph-client";
import { useData } from "@microsoft/teamsfx-react";
import { Audio } from 'react-loader-spinner'

interface IFileSelectorProps {

}

export interface IUploadableFile {
    id: string;
    file: File;
    name?: string;
    size?: number;
    type?: string;
    content?: any
}


const OneDriveIcon = () => <Icon style={{ color: '#006ac0', fontSize: '30px' }} iconName="OneDriveFolder16" />;
const volume0Icon: IIconProps = {
    iconName: 'CloudUpload',
    styles: {
        root: {
            fontSize: '16px'
        }
    }

};
const functionName = config.apiName || "myFunc";

const FileSelector: React.FC<IFileSelectorProps> = (props) => {

    const [files, setFiles] = useState<any>([]);
    const [documentPack, setDocumentPack] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [percentComplete, setPercentComplete] = React.useState(0);

    const updateFiles = async (incommingFiles: any) => {

        let mappedAcc: IUploadableFile[] = await Promise.all(incommingFiles.map(async (file: any) => {
            const fileContent = await getBase64(file.file);
            return {
                id: file.id,
                file: file.file,
                name: file ? file.name : "",
                size: file ? file.size : 0,
                type: file ? file.type : "",
                content: fileContent
            } as IUploadableFile;
        }));
        setFiles(mappedAcc);
    };

    const removeFile = (id: any) => {
        setFiles(files.filter((x: any) => x.id !== id));
    };

    const getBase64 = async (file: Blob): Promise<string | undefined> => {
        var reader = new FileReader();
        reader.readAsDataURL(file as Blob);

        return new Promise((reslove, reject) => {
            reader.onload = () => reslove(reader.result as any);
            reader.onerror = (error) => reject(error);
        })
    }

    const handleUploadFile = async () => {

        setUploading(true);
        try {
            const teamsUserCredential = TeamsUserCredentialContext.getInstance().getCredential();
            if (!teamsUserCredential) {
                throw new Error("TeamsFx SDK is not initialized.");
            }

            const apiBaseUrl = config.apiEndpoint + "/api/";
            // createApiClient(...) creates an Axios instance which uses BearerTokenAuthProvider to inject token to request header
            const apiClient = createApiClient(
                apiBaseUrl,
                new BearerTokenAuthProvider(async () => (await teamsUserCredential.getToken(""))!.token)
            );

            let mappedRequest: any[] = await Promise.all(files.map(async (file: any) => {
                return {
                    Id: file.id,
                    Name: file.name,
                    Size: file.size,
                    Type: file.type,
                    Content: file.content
                };
            }));

            const response = await apiClient.request({
                method: "post",
                url: "CreateDocumentPack",
                data: mappedRequest
            });
            console.log(response.data);
            if (response.data) {
                setDocumentPack(response.data);


            }
            setUploading(false);
        }
        catch (error) {
            setUploading(false);
        }

    }



    return (
        <>
            <div className="file-container">
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row" style={{ maxWidth: 1000, margin: '0 auto' }}>

                        <div className="ms-Grid-col ms-sm12">
                            <Card type="inner" title="Select files to create document pack" extra={<OneDriveIcon />}>
                                <Dropzone
                                    label={"Drop Files here or click to browse"}
                                    style={{ minWidth: "505px" }}
                                    onChange={updateFiles}
                                    value={files}
                                    minHeight={"150px"}
                                    // clickable={!showProgressBar}
                                    header={!uploading}

                                >
                                    {files.map((file: any) => (
                                        <FileMosaic key={file.id} {...file} onDelete={removeFile} info resultOnTooltip />

                                    ))}
                                </Dropzone>
                                <div className="ms-Grid-col ms-sm12" style={{ marginTop: '20px' }}>
                                    <DefaultButton
                                        disabled={uploading || files.length == 0}
                                        className={"upload-button"}
                                        text="Create document pack"
                                        onClick={handleUploadFile}
                                        iconProps={volume0Icon}
                                    />
                                    {uploading ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}> <Audio
                                        height="80"
                                        width="80"
                                        color='#444791'
                                        ariaLabel='three-dots-loading'
                                    /><span style={{ fontSize: 16, fontWeight: 500, margin: '5px 0' }}>Creating document pack......</span></div> : ""}
                                </div>

                                <div className="ms-Grid-col ms-sm12" style={{ marginTop: '20px' }}>
                                    {!uploading && documentPack !== null &&
                                        <Result
                                            status="success"
                                            title="Document pack has been successfully created!"
                                            subTitle=""
                                            extra={[
                                                <>
                                                    <PrimaryButton href={documentPack.WebUrl} target="_blank" title="View document pack" text='View document pack' />
                                                </>
                                            ]}
                                        />
                                    }
                                </div>
                            </Card>


                        </div>
                    </div>

                </div>
            </div>
        </>
    );

}



export default FileSelector;