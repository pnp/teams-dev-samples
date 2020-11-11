import { IAppSettingsSchemaExtension } from "../webparts/settings/components/ISettingsProps";
import {
    MSGraphClient,
} from "@microsoft/sp-http";
import { IGraphServices } from "./IGraphServices";
export interface IGraphServiceCtx {
    graphClient: MSGraphClient;
}
export default class GraphServices implements IGraphServices {
    public _MSGraphClient: MSGraphClient;
    constructor(private serviceCtx: IGraphServiceCtx) { }
   
    // Create extention with initial data
    public async _createSchemaExtension(extensionName: string, meTaskSettings: IAppSettingsSchemaExtension): Promise<any> {
        let _extensionResult: any;
        let extentionData: Object = {};
        try {
            extentionData = {
                "@odata.type": "#microsoft.graph.openTypeExtension",
                extensionName: extensionName,
                Settings: meTaskSettings
            };           
            _extensionResult = await this.serviceCtx.graphClient.api(`/me/extensions`).post(extentionData);
        } catch (ex) {
            console.log(ex);
        }     
        return _extensionResult;
    }
    // Get extention
    public async _getSchemaExtension(extensionName: string): Promise<any> {
        let _extensionResult: any;
        try {            
            _extensionResult = await this.serviceCtx.graphClient.api(`/me/extensions/${extensionName}`).get();
        } catch (ex) {
            console.log(ex);
        }
        return _extensionResult;

    }
     // Update extention with data
    public async _updateSchemaExtension(extensionName: string, meTaskSettings: IAppSettingsSchemaExtension): Promise<any> {
        let _extensionResult: any;
        let extentionData: Object = {};
        try {
            extentionData = {
                "@odata.type": "#microsoft.graph.openTypeExtension",
                extensionName: extensionName,
                Settings: meTaskSettings
            };           
            _extensionResult = await this.serviceCtx.graphClient.api(`/me/extensions/${extensionName}`).patch(extentionData);

        } catch (ex) {
            console.log(ex);
        }
        return _extensionResult;
    }
}