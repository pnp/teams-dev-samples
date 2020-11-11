import * as React from 'react';
import styles from './Insights.module.scss';
import { IInsightsProps } from './IInsightsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Get, Tasks } from 'mgt-react';

import { Customizer } from 'office-ui-fabric-react';
import Files from '../../../common/components/Files';

export interface IInsightsState {
  
}
export default class Insights extends React.Component<IInsightsProps,IInsightsState> {
  constructor(props) {
    super(props);
    this.state = {};
  }
    public render(): React.ReactElement<IInsightsProps> {  
    const { displayName, loginName } = this.props;
    return (
      <Customizer settings={{ theme: this.props.themeVariant }}>
      <div className={styles.insights}>              
        <div  className={styles.felxColumn}>
          <div className={styles.webpartTitle}>Trending around me</div>
          <Get resource="/me/insights/trending" maxPages={1} >
            <Files template="default" userLoginName={loginName} userDisplayName={displayName} />
          </Get>
        </div>

        <div className={styles.felxColumn}>
          <div className={styles.webpartTitle} >Shared with me</div>
          <Get resource="/me/insights/shared" maxPages={1} >
            <Files template="default" userLoginName={loginName} userDisplayName={displayName} />
          </Get>
        </div>
        <div className={styles.felxColumn}>
          <div  className={styles.webpartTitle}>Viewed and modified by me</div>
          <Get resource="/me/insights/used" maxPages={1} >
            <Files template="default" userLoginName={loginName} userDisplayName={displayName} />
          </Get>
        </div>
      </div>
      </Customizer>
    );
  }
}
