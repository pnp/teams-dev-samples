import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { IGraphServices } from "../../../services/IGraphServices";
export interface ISettingsProps {
  context: WebPartContext;
  themeVariant: IReadonlyTheme | undefined;
  graphService:IGraphServices;

}


export interface IAppSettingsSchemaExtension {
  agendaDays: number;  
}


export interface ISettingsState {
  data: IAppSettingsSchemaExtension;
}
