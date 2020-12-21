import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

export class Constants {
  public static readonly LISTTYPE: IDropdownOption[] = [
    { key: 100, text:'Custom List' },
    { key: 101, text:'Document Library' },
    { key: 102, text:'Survey' },
    { key: 103, text:'Links' },
    { key: 104, text:'Announcements' },
    { key: 105, text:'Contacts' },
    { key: 106, text:'Calendar' },
    { key: 107, text:'Tasks' },
    { key: 108, text:'Discussion Board' },
    { key: 109, text:'Picture Library' },
    { key: 110, text:'DataSources' },
    { key: 115, text:'Form Library' },
    { key: 117, text:'No Code Workflows' },
    { key: 118, text:'Custom Workflow Process' },
    { key: 119, text:'Wiki Page Library' },
    { key: 120, text:'CustomGrid' },
    { key: 122, text:'No Code Public Workflows<14>' },
    { key: 140, text:'Workflow History' },
    { key: 150, text:'Project Tasks' },
    { key: 600, text:'Public Workflows External List<15>' },
    { key: 1100, text:'Issues Tracking' }
  ];
}