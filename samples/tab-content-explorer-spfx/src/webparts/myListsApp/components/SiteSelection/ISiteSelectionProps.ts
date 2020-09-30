import { ISPDataSvc } from '../../services/SPService/ISPDataSvc';

export interface ISiteSelectionProps {
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
}
