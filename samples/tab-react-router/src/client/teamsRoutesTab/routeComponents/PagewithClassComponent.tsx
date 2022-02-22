import * as React from 'react';

export interface IPagewithClassComponentProps {}

export interface IPagewithClassComponentState {}

export default class PagewithClassComponent extends React.Component<IPagewithClassComponentProps, IPagewithClassComponentState> {

  constructor(props: IPagewithClassComponentProps) {
    super(props);

    this.state = {
      
    };
  }

  public render(): React.ReactElement<IPagewithClassComponentProps> {
    return (
      <div>
        This is class component
      </div>
    );
  }
}

