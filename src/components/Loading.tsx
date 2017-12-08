import * as React from "react";
import { observer, inject } from "mobx-react";
import AppState, { StatusEnum } from "../stores/AppState";

declare interface Props {
    appState?: AppState;
    style?: React.CSSProperties;    
}

@inject("appState")
@observer
export class Loading extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    let loadingText;
    let display = true
    switch (this.props.appState.status) {
        case StatusEnum.Authenticating:
            loadingText = "Authenticating....";
            break;
        case StatusEnum.CheckingPermission:
            loadingText = "Checking permission...";
            break;
        case StatusEnum.LoadingContent:
            loadingText = "Loading content...";
            break;
          case StatusEnum.LoadingFailed:
            loadingText = "Loading failed! Is the filepath correct?";
            break;
        case StatusEnum.Submitting:
            loadingText = "Submitting...";
            break;
        default:
            display = false;
    }
    return display && <div className="loading-cover" style={this.props.style}>{loadingText}</div>;
  }
};