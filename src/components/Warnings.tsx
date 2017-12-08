import * as React from 'react';
import { observer, inject } from "mobx-react";
import AppState from "../stores/AppState";
import { toJS } from 'mobx';

declare interface Props {
  appState?: AppState;
}

@inject("appState")
@observer
export class Warnings extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.appState.isMobile) {
      this.props.appState.generateWarnings();
    }
  }

  render() {
    return  <div>
      {this.props.appState.warnings.map((w: any, i) => <div key={i} className={`text-${w.status}`} style={w.status === "danger" ? {borderBottom: '#a94442 1px dotted'} : {borderBottom: '#8a6d3b 1px dotted'}}>{w.errorText}</div>)}
    </div>
  }
}