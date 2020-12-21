import { IColumn, IGroup }  from 'office-ui-fabric-react/lib/DetailsList';
import { IList }            from '../interfaces/IList';
import { MessageBarType }   from 'office-ui-fabric-react/lib/MessageBar';


export interface IMyListsAppState {
  isLoading: boolean;
  error: boolean;
  statusMsg: string;
  msgType: MessageBarType;
  lists: IList[];
  columns: IColumn[];
  groupedLists: any[];
  groups: IGroup[];
  clearCache: boolean;
}