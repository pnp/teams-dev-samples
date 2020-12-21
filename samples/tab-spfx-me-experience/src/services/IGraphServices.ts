import { IAppSettingsSchemaExtension } from "../webparts/settings/components/ISettingsProps";

// Public members 
export interface IGraphServices {
    _createSchemaExtension(extensionName:string,meTaskSettings: IAppSettingsSchemaExtension): Promise<any>;
    _updateSchemaExtension(extensionName:string,meTaskSettings: IAppSettingsSchemaExtension): Promise<any>;
    _getSchemaExtension(extensionName:string): Promise<any>;
}