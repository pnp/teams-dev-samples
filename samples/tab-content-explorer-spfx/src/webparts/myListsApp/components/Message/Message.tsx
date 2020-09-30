import * as React from 'react';
import { 
  MessageBar, 
  MessageBarType 
}                 from 'office-ui-fabric-react/lib/MessageBar';

/*************************************************************************************
* Interface to implement the Message Webpart
*
* @export
* @interface IMessageProps
*************************************************************************************/
export interface IMessageProps {
  Message: string;
  Type: MessageBarType;
  Display: boolean;
}

/*************************************************************************************
* React Message for displaying the messages
*
* @export
* @class Message
* @extends {React.Component<IMessageProps, any>}
*************************************************************************************/
export default class Message extends React.Component<IMessageProps, any> {

  /*************************************************************************************
  *Creates an instance of Message.
  * @param {IMessageProps} props
  * @memberof Message
  *************************************************************************************/
  public constructor(props: IMessageProps) {
    super(props);
  }


  /*************************************************************************************
  * Render method of the Message Component
  *
  * @returns {React.ReactElement<IMessageProps>}
  * @memberof Message
  *************************************************************************************/
  public render(): React.ReactElement<IMessageProps> {

    return (
      <div className={`ms-Grid-row`}>
        <div className={`ms-Grid-col ms-sm12`}>
          {
            this.props.Display &&
            <div>
              <MessageBar
                messageBarType={this.props.Type}
                isMultiline={false}
                dismissButtonAriaLabel="Close">
                {this.props.Message}
              </MessageBar>
            </div>
          }
        </div>
      </div>
    );
  }
}
