import * as React from "react";
import { observer, inject } from "mobx-react";
import AppState, { StatusEnum } from "../stores/AppState";

declare interface Props {
    appState?: AppState;
    style?: React.CSSProperties;
}

@inject("appState")
@observer
export class InputScreen extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        let display = true;
        let text;
        let yesText;
        let yesCallback;
        let noText;
        let noCallback;
        switch (this.props.appState.status) {
            case StatusEnum.Submitted:
                text = <div><div className="text-success">Submission succeeded.</div><div>Your changes have been made to the repo.</div></div>
                yesText = "Okay";
                yesCallback = () =>
                    this.props.appState.setStatus(StatusEnum.Loaded);
                break;
            case StatusEnum.SubmittingFailed:
                text = <div><div className="text-danger">Submission failed.</div><div>Try again or return to the edit screen.</div></div>
                yesText = "Try again";
                yesCallback = () => {};
                noText = "Go back";
                noCallback = () =>
                    this.props.appState.setStatus(StatusEnum.Loaded);
                break;
            default:
                display = false;
        }
        return (
            display && (
                <div className="input-cover" style={this.props.style}>
                    {text}
                    <div>
                        {noCallback && (
                            <button className="btn btn-default" onClick={noCallback}>{noText}</button>
                        )}
                        { (yesCallback && noCallback ) && <span style={{padding:"0 2px"}}></span> }
                        {yesCallback && (
                            <button className="btn btn-default" onClick={yesCallback}>{yesText}</button>
                        )}
                    </div>
                </div>
            )
        );
    }
}
