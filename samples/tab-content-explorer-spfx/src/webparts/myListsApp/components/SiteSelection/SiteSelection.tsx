import * as React               from 'react';
import styles                   from './SiteSelection.module.scss';
import { ISiteSelectionProps }  from './ISiteSelectionProps';
import { ISiteSelectionState }  from './ISiteSelectionState';
import { ISPWeb }               from '../../interfaces/ISPWeb';
import { ISPSite }              from '../../interfaces/ISPSite';
import { 
  IHubSite, 
  IHubSitesResponse 
}                               from '../../interfaces/IHubSites';
import { 
  IListHelper, 
  ListHelper
}                               from '../../helpers';
import { 
  Dropdown, 
  IDropdownOption 
}                               from 'office-ui-fabric-react/lib/Dropdown';


export class SiteSelection extends React.Component<ISiteSelectionProps, ISiteSelectionState> {
  private listHelper: IListHelper;


  /*************************************************************************************
  * Component's constructor
  * @param props 
  * @param state 
  *************************************************************************************/
  constructor(props: ISiteSelectionProps) {
    super(props);

    this.listHelper = new ListHelper();

    this.state = {
      siteInfo: null,
      subSitesDropDownOptions: [],
      selectedSubSite: undefined,
      isHubSite: false,
      hubSitesAndSubsitesList: [],
      hubsDropDownOptions: [],
      selectedHub: undefined
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
      this.props.openLinksInTeams !== prevProps.openLinksInTeams
    ) {
      this._loadSites();
    }
  }


  private _loadSites(): void {
    this.setState({
      siteInfo: null,
      subSitesDropDownOptions: [],
      selectedSubSite: undefined,
      isHubSite: false,
      hubSitesAndSubsitesList: [],
      hubsDropDownOptions: [],
      selectedHub: undefined
    });

    this.props.listService.GetSiteInfo(this.props.siteURL)
      .then((siteInfo: ISPSite) => {
        if (siteInfo.IsHubSite) {
          this.props.listService.GetAssociatedHubSites(siteInfo.Url, siteInfo.HubSiteId)
            .then((associatedHubsResponse: IHubSitesResponse) => {
              const hubSitesAndSubsitesList: IHubSite[] = this.listHelper.prepareHubSites(siteInfo.HubSiteId, associatedHubsResponse.Items);

              if (!hubSitesAndSubsitesList.length) {
                const errorMsg: string = `Error – Limit Reached / Partial Retrieval. Failed to retrieve all Hubsites and Child hubsites.`;
                
                console.error(errorMsg);

                this.props.setError(errorMsg);
              }

              const hubsDropDownOptions: IDropdownOption[] = this.listHelper.prepareHubSitesDropDown(hubSitesAndSubsitesList[0].path, hubSitesAndSubsitesList, false);
    
              const selectedHub: IDropdownOption = hubsDropDownOptions[0];
    
              this.setState({
                isHubSite: true,
                hubSitesAndSubsitesList: hubSitesAndSubsitesList,
                hubsDropDownOptions: hubsDropDownOptions,
                selectedHub: selectedHub
              });

              if (this.props.includeSubsites) {
                this._getHubSubSites(selectedHub.key.toString(), 0);
              } else {
                this.props.getSPLists(selectedHub.key.toString());
              }
            })
            .catch((errorMsg: string) => {
              this.props.setError(errorMsg);

              this.props.getSPLists(siteInfo.Url);
            });
        } else {
          if (this.props.includeSubsites) {

            this._getSPSubSites(siteInfo);

          } else {
            this.setState({
              siteInfo: siteInfo
            });

            this.props.getSPLists(siteInfo.Url);
          }
        }
      })
      .catch((errorMsg: string) => {
        this.props.setError(errorMsg);
    
        this.props.getSPLists(this.props.siteURL);
      });
  }


  private _getHubSubSites(hubPath: string, hubIndex: number): void {
    // Check if selected hub site has subsites
    if (this.state.hubSitesAndSubsitesList[hubIndex].subSites) {
      const currentSubSites: IHubSite[] = this.state.hubSitesAndSubsitesList[hubIndex].subSites;
      
      const hubSubSitesDropDownOptions: IDropdownOption[] = this.listHelper.prepareHubSitesDropDown(hubPath, currentSubSites, true);

      let selectedHubSubSite = hubSubSitesDropDownOptions[0];

      this.setState({
        subSitesDropDownOptions: hubSubSitesDropDownOptions,
        selectedSubSite: selectedHubSubSite
      }, () => {
        this.props.getSPLists(hubPath);
      });
    } else {
      this.props.getSPLists(hubPath);
    }
  }


  private _getSPSubSites(siteInfo: ISPSite): void {
    this.props.listService.GetSPSubSites(siteInfo.Url)
      .then((res: ISPWeb[]) => {
        if (res.length) {
          const subSitesDropDownOptions: IDropdownOption[] = this.listHelper.prepareSubSiteDropDown(siteInfo.Url, res);
          
          let selectedSubSite = subSitesDropDownOptions[0];
  
          this.setState({
            siteInfo: siteInfo,
            selectedSubSite: selectedSubSite,
            subSitesDropDownOptions: subSitesDropDownOptions
          }, () => {
            this.props.getSPLists(siteInfo.Url);
          });
        } else {
          this.setState({
            siteInfo: siteInfo
          });

          this.props.getSPLists(siteInfo.Url);
        }
      })
      .catch((error: string) => {
        this.props.setError(error);

        this.setState({
          siteInfo: siteInfo
        });

        this.props.getSPLists(siteInfo.Url);
      });
  }


  public render(): JSX.Element {
    const { siteInfo, isHubSite, selectedSubSite, subSitesDropDownOptions, selectedHub, hubsDropDownOptions } = this.state;
    
		return (
      <div className={ styles.siteSelection }>
        <div className="ms-Grid" dir="ltr">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg6">
              { !isHubSite && siteInfo !== null &&
                <div className={styles.dropDown}>
                  <Dropdown
                    disabled={true}
                    selectedKey={siteInfo.Url}
                    options={[{
                      key: siteInfo.Url,
                      text: siteInfo.Url === siteInfo.RootWeb.Url ? siteInfo.RootWeb.Title : siteInfo.Url.split('/').pop()
                    }]}
                  />
                </div>
              }
              { isHubSite && hubsDropDownOptions.length > 0 && 
                <div className={styles.dropDown}>
                  <Dropdown
                    selectedKey={selectedHub ? selectedHub.key : undefined}
                    onChange={this._handleHubChange}
                    placeholder="Select a subsite"
                    options={hubsDropDownOptions}
                  />
                </div>
              }
            </div>
            <div className="ms-Grid-col ms-sm6 ms-md8 ms-lg6">
              { subSitesDropDownOptions.length > 0 && 
                <div className={styles.dropDown}>
                  <Dropdown
                    selectedKey={selectedSubSite ? selectedSubSite.key : undefined}
                    onChange={this._handleSubSiteChange}
                    placeholder="Select a subsite"
                    options={subSitesDropDownOptions}
                  />
                </div>
              }
            </div>
          </div>
        </div>

      </div>
		);
  }


  private _handleSubSiteChange = (event: React.FormEvent<HTMLDivElement>, subSiteOption: IDropdownOption): void => {
    console.log(`Sub Site change: ${subSiteOption.text} ${subSiteOption.selected ? 'selected' : 'unselected'}`);

    this.setState({ 
      selectedSubSite: subSiteOption
    });

    this.props.getSPLists(subSiteOption.key.toString());
  }

  
  private _handleHubChange = (event: React.FormEvent<HTMLDivElement>, hubOption: IDropdownOption, hubIndex: number): void => {
    console.log(`Sub Site change: ${hubOption.text} ${hubOption.selected ? 'selected' : 'unselected'}`);

    this.setState({ 
      selectedHub: hubOption,
      subSitesDropDownOptions: [],
      selectedSubSite: undefined
    });

    if (this.props.includeSubsites) {
      this._getHubSubSites(hubOption.key.toString(), hubIndex);
    } else {
      this.props.getSPLists(hubOption.key.toString());
    }
  }

}
