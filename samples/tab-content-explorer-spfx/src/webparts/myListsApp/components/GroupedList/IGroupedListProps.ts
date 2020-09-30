import { ISPDataSvc } from '../../services/SPService/ISPDataSvc';
import { IColumn }    from 'office-ui-fabric-react/lib/DetailsList';


export interface IGroupedListProps {
  listService: ISPDataSvc;
  siteURL: string;
  setError: (errorMsg: string) => void;
  getSPLists: (siteUrl: string) => void;
  includeDocLibraries: boolean;
  includeEventLists: boolean;
  includeCustomLists: boolean;
  includeSystemLibraries: boolean;
  includeSubsites: boolean;
  openLinksInTeams: boolean;
  displayLayout: string;
  setupColumns: () => IColumn[];
}
