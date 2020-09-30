import * as React             from 'react';
import styles                 from './GroupedList.module.scss';
import { IGroupedListProps }  from './IGroupedListProps';
import { IGroupedListState }  from './IGroupedListState';
import Message                from "../Message/Message";
import { ISPSite }            from '../../interfaces/ISPSite';
import { ISPWeb }             from '../../interfaces/ISPWeb';
import { ISPList }            from '../../interfaces/ISPList';
import { IList }              from '../../interfaces/IList';
import { IHubSitesResponse }  from '../../interfaces/IHubSites';
import { ISiteGroup }         from "../../interfaces/ISiteGroup";
import { 
  IListHelper, 
  ListHelper 
}                             from '../../helpers';
import { MessageBarType }     from 'office-ui-fabric-react/lib/MessageBar';
import { 
	DetailsList, 
	SelectionMode
}                             from 'office-ui-fabric-react/lib/DetailsList';
import { 
  Spinner, 
  SpinnerSize 
}                             from 'office-ui-fabric-react/lib/Spinner';


export class GroupedList extends React.Component<IGroupedListProps, IGroupedListState> {

  private listHelper: IListHelper;


  /*************************************************************************************
  * Component's constructor
  * @param props 
  * @param state 
  *************************************************************************************/
  constructor(props: IGroupedListProps) {
    super(props);

    this.listHelper = new ListHelper();

    this.state = {
      isLoading: true,
      error: false,
      statusMsg: null,
      msgType: null,
      columns: this.props.setupColumns(),
      groupedLists: [],
      groups: []
    };
  }


  /*************************************************************************************
	* When components are mounted, get lists
	*************************************************************************************/
  public componentDidMount(): void {
    this._loadSites();
  }


  public componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (
      this.props.siteURL !== prevProps.siteURL ||
      this.props.includeDocLibraries !== prevProps.includeDocLibraries ||
      this.props.includeEventLists !== prevProps.includeEventLists ||
      this.props.includeCustomLists !== prevProps.includeCustomLists ||
      this.props.includeSystemLibraries !== prevProps.includeSystemLibraries ||
      this.props.includeSubsites !== prevProps.includeSubsites ||
      this.props.openLinksInTeams !== prevProps.openLinksInTeams ||
      this.props.displayLayout !== prevProps.displayLayout
    ) {
      this._loadSites();
    } 
  }


  private _loadSites(): void {
    this.setState({
      isLoading: true,
      error: false,
      statusMsg: null,
      msgType: null,
      groupedLists: [],
      groups: []
    });

    this.props.listService.GetSiteInfo(this.props.siteURL)
      .then((siteInfo: ISPSite) => {
        const rootGroup: ISiteGroup = this.listHelper.prepareRootGroup(siteInfo);
        const rootGroupArr: ISiteGroup[] = [rootGroup];

        if (siteInfo.IsHubSite) {
          this.props.listService.GetAssociatedHubSites(siteInfo.Url, siteInfo.HubSiteId)
            .then((associatedHubsResponse: IHubSitesResponse) => {              
              const groupedHubs: ISiteGroup[] = this.listHelper.prepareGroupedHubSites(siteInfo, associatedHubsResponse.Items, this.props.includeSubsites);

              this._getSPListsBatch(groupedHubs);

            })
            .catch((errorMsg: string) => {
              this.setState({
                isLoading: false,
                error: true,
                statusMsg: errorMsg,
                msgType: MessageBarType.error
              });
            });
        } else {
          if (this.props.includeSubsites) {

            this._getSPSubSites(rootGroupArr);

          } else {

            this._getSPListsBatch(rootGroupArr);
          }
        }
      })
      .catch((errorMsg: string) => {
        this.setState({
          isLoading: false,
          error: true,
          statusMsg: errorMsg,
          msgType: MessageBarType.error
        });
      });
  }


  private _getSPListsBatch(groupedHubs: ISiteGroup[]): void {
    this.props.listService.GetSPListsBatch(
      groupedHubs,
      this.props.includeDocLibraries,
      this.props.includeEventLists,
      this.props.includeCustomLists,
      this.props.includeSystemLibraries
    )
      .then((batchedLists: ISPList[][]) => {
        const filteredBatchedLists: ISPList[][] = this.listHelper.filterBatchedLists(batchedLists, this.props.includeDocLibraries, this.props.includeSystemLibraries);

        const numberedGroupedHubs: ISiteGroup[] = this.listHelper.prepareNumberedGroupedHubs(groupedHubs, filteredBatchedLists);

        const preparedGroupedLists: IList[] = this.listHelper.prepareGroupedLists(numberedGroupedHubs, filteredBatchedLists, this.props.openLinksInTeams);


        this.setState({
          isLoading: false,
          groupedLists: preparedGroupedLists,
          groups: numberedGroupedHubs
        });

      })
      .catch((error: any) => {
        debugger;
      });
  }


  private _getSPSubSites(rootGroupArr: ISiteGroup[]): void {
    this.props.listService.GetSPSubSites(rootGroupArr[0].key)
      .then((subsites: ISPWeb[]) => {
        if (subsites.length) {
          const groupedSubsites: ISiteGroup[] = this.listHelper.prepareGroupedSubSites(rootGroupArr[0], subsites);

          this._getSPListsBatch(groupedSubsites);
        } else {
          this._getSPListsBatch(rootGroupArr);
        }
      })
      .catch((errorMsg: string) => {
        this.setState({
          isLoading: false,
          error: true,
          statusMsg: errorMsg,
          msgType: MessageBarType.error
        });

        this._getSPListsBatch(rootGroupArr);
      });
  }


  private renderMessage(statusMessage: string, statusMessageType: MessageBarType,
    display: boolean): JSX.Element {
    return (
      <Message Message={statusMessage} Type={statusMessageType} Display={display} />
    );
  }


  public render(): JSX.Element {
    const { 
      isLoading, 
      error, 
      statusMsg, 
      msgType, 
      columns, 
      groupedLists, 
      groups 
    } = this.state;

		return (
      <div className={ styles.groupedList }>
        {
          error &&
          this.renderMessage(statusMsg, msgType, true)
        }

        {
          isLoading &&
          <Spinner size={SpinnerSize.large} />
        }

        {
          !isLoading &&
          !error &&
          <DetailsList
            items={groupedLists}
            groups={groups}
            columns={columns}
            selectionMode={SelectionMode.none}
            groupProps={{
              showEmptyGroups: true
            }}
          />
        }
      </div>
		);
  }
}
