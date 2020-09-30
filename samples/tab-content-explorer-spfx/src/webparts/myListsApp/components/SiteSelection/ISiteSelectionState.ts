import { IHubSite }         from '../../interfaces/IHubSites';
import { ISPSite }          from '../../interfaces/ISPSite';
import { IDropdownOption }  from 'office-ui-fabric-react/lib/Dropdown';


export interface ISiteSelectionState {
  siteInfo: ISPSite;
  subSitesDropDownOptions: IDropdownOption[];
  selectedSubSite: {
    key: string | number | undefined
  };
  isHubSite: boolean;
  hubSitesAndSubsitesList: IHubSite[];
  hubsDropDownOptions: IDropdownOption[];
  selectedHub: {
    key: string | number | undefined
  };
}
