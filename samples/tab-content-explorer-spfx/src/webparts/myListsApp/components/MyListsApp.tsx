import * as React           from 'react';
import styles               from './MyListsApp.module.scss';
import { IMyListsAppProps } from './IMyListsAppProps';
import { IMyListsAppState } from './IMyListsAppState';
import Message              from "./Message/Message";
import { IList }            from '../interfaces/IList';
import { ISPList }          from '../interfaces/ISPList';
import { SiteSelection }    from "./SiteSelection/SiteSelection";
import { GroupedList }      from "./GroupedList/GroupedList";
import { ISPDataSvc }       from '../services/SPService/ISPDataSvc';
import { SPDataSvc }        from '../services/SPService/SPDataSvc';
import { IListHelper }      from '../helpers/IListHelper';
import { ListHelper }       from '../helpers/ListHelper';
import { 
	DetailsList, 
	SelectionMode, 
    IColumn
}                           from 'office-ui-fabric-react/lib/DetailsList';
import { Link }             from 'office-ui-fabric-react/lib/Link';
import { 
  Spinner, 
  SpinnerSize 
}                           from 'office-ui-fabric-react/lib/Spinner';
import { MessageBarType }   from 'office-ui-fabric-react/lib/MessageBar';



export default class MyListsApp extends React.Component<IMyListsAppProps, IMyListsAppState> {

  private listHelper: IListHelper;
  /*************************************************************************************
  * Stores the List Service Instance
  *************************************************************************************/
  private listService: ISPDataSvc;


  /*************************************************************************************
  * Component's constructor
  * @param props 
  * @param state 
  *************************************************************************************/
  constructor(props: IMyListsAppProps) {
    super(props);

    this.listHelper = new ListHelper();

    this.listService = new SPDataSvc(this.props.siteURL, this.props.context);

    this.state = {
      isLoading: true,
      error: false,
      statusMsg: null,
      msgType: null,
      lists: [],
      columns: this._setupColumns(),
      groupedLists: [],
      groups: [],
      clearCache: false
    };
  }


  /*************************************************************************************
  * When components are mounted, get lists
  *************************************************************************************/
  public componentDidMount(): void {
    this._isLoading();
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
      this.props.displayLayout !== prevProps.displayLayout
    ) {
      this.setState({
        clearCache: true
      });

      this._isLoading();
    } else if (this.props.openLinksInTeams !== prevProps.openLinksInTeams) {
      this._isLoading();
    }
  }


  private _isLoading(): void {
    this.setState({
      isLoading: true,
      error: false,
      lists: [],
      groupedLists: [],
      groups: []
    });
  }


  private _getSPLists(siteUrl: string): void {
    this._isLoading();

    this.listService.GetSPLists(
      siteUrl, 
      this.state.clearCache,
      this.props.includeDocLibraries,
      this.props.includeEventLists,
      this.props.includeCustomLists,
      this.props.includeSystemLibraries
    )
      .then((res: ISPList[]) => {
        const formattedList: IList[] = this.listHelper.prepareLists(siteUrl, res, this.props.includeDocLibraries, this.props.includeSystemLibraries, this.props.openLinksInTeams);

        this.setState({
          isLoading: false,
          lists: formattedList,
          clearCache: false
        });
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


  public setError(errorMsg: string): void {
    this.setState({
      error: true,
      statusMsg: errorMsg,
      msgType: MessageBarType.error
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
      lists,
      columns
    } = this.state;
		
		return (
      <div className={ styles.myListsApp }>
        {
          this.props.displayLayout !== 'grouped' &&      
          <div>  
            <SiteSelection
              listService={this.listService}
              siteURL={this.props.siteURL}
              setError={this.setError.bind(this)}
              getSPLists={this._getSPLists.bind(this)}
              includeDocLibraries={this.props.includeDocLibraries}
              includeEventLists={this.props.includeEventLists}
              includeCustomLists={this.props.includeCustomLists}
              includeSystemLibraries={this.props.includeSystemLibraries}
              includeSubsites={this.props.includeSubsites}
              openLinksInTeams={this.props.openLinksInTeams}
            />

            {
              error &&
              this.renderMessage(statusMsg, msgType, true)
            }

            {
              isLoading &&
              <Spinner size={SpinnerSize.large} />
            }

            { lists.length > 0 &&
              <DetailsList
                items={lists}
                columns={columns}
                selectionMode={SelectionMode.none}
                setKey="none"
                isHeaderVisible={true}
              />
            }

            {
              !isLoading &&
              !error &&
              lists.length === 0 &&
              this.renderMessage(`No Lists or Libraries to display. Please adjust filters to see more contents.`, MessageBarType.info, true)
            }
          </div>
        }

        { 
          this.props.displayLayout === 'grouped' &&
          <GroupedList
            listService={this.listService}
            siteURL={this.props.siteURL}
            setError={this.setError.bind(this)}
            getSPLists={this._getSPLists.bind(this)}
            includeDocLibraries={this.props.includeDocLibraries}
            includeEventLists={this.props.includeEventLists}
            includeCustomLists={this.props.includeCustomLists}
            includeSystemLibraries={this.props.includeSystemLibraries}
            includeSubsites={this.props.includeSubsites}
            openLinksInTeams={this.props.openLinksInTeams}
            displayLayout={this.props.displayLayout}
            setupColumns={this._setupColumns.bind(this)}
          />
        }

      </div>
		);
  }


  private _setupColumns(): IColumn[] {

    const listColumns: IColumn[] = [
      { 
        key: 'column1', 
        name: 'File Type', 
        className: styles.fileIconCell,
        iconClassName: styles.fileIconHeaderIcon,
        iconName: 'Page',
        isIconOnly: true,
        minWidth: 16,
        maxWidth: 16,
        onRender: (item: IList) => {
          return <img className={styles.fileIconImg} src={this.props.siteURL + item.iconUrl} alt={item.name + ' list icon'} />;
        }
      },
      { 
        key: 'column2', 
        name: 'Name', 
        fieldName: 'name', 
        minWidth: 210,
        maxWidth: 225,
        isRowHeader: true, 
        isResizable: true, 
        data: 'string', 
        isPadded: true,
        onRender: (item: IList) => {
          return <Link className={styles.listLink} href={item.url} target={item.target}>{item.name}</Link>;
        }
      },
      { 
        key: 'column3', 
        name: 'Type', 
        fieldName: 'type', 
        minWidth: 70,
        maxWidth: 215,
        isResizable: true, 
        data: 'string', 
        isPadded: true,
        onRender: (item: IList) => {
          return <span>{item.type}</span>;
        },
      },
      { 
        key: 'column4', 
        name: 'Items', 
        fieldName: 'items', 
        minWidth: 40,
        maxWidth: 60,
        isResizable: true, 
        isCollapsible: true,
        data: 'number', 
        isPadded: true,
        onRender: (item: IList) => {
          return <span>{item.items}</span>;
        },
      },
      { 
        key: 'column5', 
        name: 'Modified', 
        fieldName: 'modified', 
        minWidth: 100,
        maxWidth: 120,
        isResizable: true,
        isCollapsible: true,
        data: 'string', 
        isPadded: true,
        onRender: (item: IList) => {
          return <span>{item.modified}</span>;
        },
      }
    ];

    return listColumns;
  }

}
