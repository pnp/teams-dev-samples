import { IGroup } from 'office-ui-fabric-react/lib/DetailsList';

export interface ISiteGroup extends IGroup {
  title?: string;
  siteId?: string;
}