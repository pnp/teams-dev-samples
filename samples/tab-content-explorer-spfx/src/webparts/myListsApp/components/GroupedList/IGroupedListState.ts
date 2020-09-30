import { IColumn }        from 'office-ui-fabric-react/lib/DetailsList';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { IList }          from '../../interfaces/IList';
import { ISiteGroup }     from "../../interfaces/ISiteGroup";


export interface IGroupedListState {
  isLoading: boolean;
  error: boolean;
  statusMsg: string;
  msgType: MessageBarType;
  columns: IColumn[];
  groupedLists: IList[];
  groups: ISiteGroup[];
}