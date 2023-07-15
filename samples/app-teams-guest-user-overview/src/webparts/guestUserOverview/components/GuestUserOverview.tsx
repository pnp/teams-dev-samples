import * as React from 'react';
import styles from './GuestUserOverview.module.scss';
import useGuests from '../../../hooks/UseGuests';
import { DetailsList, DetailsListLayoutMode, SelectionMode, ShimmeredDetailsList, Spinner, Selection, Panel, SearchBox, IColumn, Text } from '@fluentui/react';
import { GuestUserDetailListColumns, _onRenderRow } from './GuestUserDetailListColumns';
import { IGuestUser } from '../../../models/IGuestUser';
import { GuestUserPanel } from './GuestUserPanel/GuestUserPanel';

export interface IGuestUserOverviewProps {

}

export const GuestUserOverview: React.FunctionComponent<IGuestUserOverviewProps> = (props: React.PropsWithChildren<IGuestUserOverviewProps>) => {
  const { Guests, isLoading } = useGuests();
  const [selectedUserId, setSelectedUserId] = React.useState<string>(null);

  const selection = React.useMemo(() => new Selection({
    selectionMode: SelectionMode.single,
    onSelectionChanged: () => {
      setSelectedUserId((selection.getSelection()[0] as IGuestUser)?.id);
    },
  }), []);

  return (
    <>
      <GuestUserPanel
        OnClose={() => {
          selection.setAllSelected(false);
          setSelectedUserId(null);
        }}
        UserId={selectedUserId}
      />

      <ShimmeredDetailsList
        items={Guests}
        columns={GuestUserDetailListColumns}
        enableShimmer={Guests.length == 0 && isLoading}
        shimmerLines={100}
        selection={selection}
        selectionPreservedOnEmptyClick={true}
        selectionMode={isLoading ? SelectionMode.none : SelectionMode.single}
        onRenderRow={_onRenderRow}
      />
    </>
  );
};