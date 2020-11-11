import * as React from 'react';
import styles from './Settings.module.scss';
import { IAppSettingsSchemaExtension, ISettingsProps, ISettingsState } from './ISettingsProps';

import {
  MSGraphClient,
} from "@microsoft/sp-http";
import { Customizer, DefaultButton, Label, TextField } from 'office-ui-fabric-react';

export default class Settings extends React.Component<ISettingsProps, ISettingsState> {
  public _MSGraphClient: MSGraphClient;
  constructor(props) {
    super(props);
    this._update = this._update.bind(this);
    this._onChangeText = this._onChangeText.bind(this);
    this.state = {
      data: null
    };
  }

//copy new value to state
  private _onChangeText(value: any): void {
    let stateCopy: IAppSettingsSchemaExtension = this.state.data;
    stateCopy.agendaDays = value;
    this.setState({
      data: stateCopy
    });
  }

  public async componentDidMount(): Promise<void> {
    this._MSGraphClient = await this.props.context.msGraphClientFactory.getClient();
    const value: any = await this.props.graphService._getSchemaExtension("MeSettings");
    if (!value)
      await this.props.graphService._createSchemaExtension("MeSettings", { agendaDays: 10 });  //create initially
    else {
      this.setState({
        data: value.Settings ? value.Settings : null
      });
    }

  }
  //updated my settings
  public async _update(): Promise<void> {
    await this.props.graphService._updateSchemaExtension("MeSettings", this.state.data);

  }


  public render(): React.ReactElement<ISettingsProps> {
    return (
      <Customizer settings={{ theme: this.props.themeVariant }}>

        <div >
          <h2 className={styles.text} >Your Me experience settings</h2>
          {this.state.data && 
            <><div>
              <Label className={styles.text} htmlFor={`textTaskDays`}>Get events for this many days ahead</Label>
              <TextField id={`textTaskDays`}
                defaultValue={this.state.data.agendaDays.toString()} onChanged={this._onChangeText}
              />
            </div>
              <div></div>
              <DefaultButton className={styles.button}
                primary={true}
                text="Update"
                onClick={this._update} /></>
          }
        </div>
      </Customizer>

    );
  }
}
