import * as React from "react";
import { observer, inject } from "mobx-react";
import AppState from "../stores/AppState";

declare interface State {
    path: string;
    commit: string;
    valid: boolean;
}

declare interface Props {
    appState?: AppState;
}

@inject("appState")
@observer
export class SubmitControls extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            path: "",
            commit: "",
            valid: false
        };
    }

    setCommitMessage = (commit: string) => {
        this.setState({ commit });
        this.isValid({ commit });
    };

    setPath = (path: string) => {
        this.setState({ path });
        this.isValid({ path });
    };

    isValid = (replaceState: {} = {}) => {
        let state = this.state;
        let validState = { ...this.state, ...replaceState }
        let { path, commit } = validState;
        if (!this.props.appState.isNewContent) {
            this.setState({ valid: (commit) ? true : false })            
        } else {
            this.setState({ valid: (path && commit) ? true : false })
        }
    }

    submit = () => {
        let { path, commit } = this.state;
        if (!this.props.appState.isNewContent) {
            this.props.appState.submitContent(this.props.appState.filePath, commit);
            return;
        }
        this.props.appState.submitContent(path, commit);
    };

    render() {
        return (
            <div>
                {this.props.appState.isNewContent && (
                    <div id="path-selector">
 
                                <div id="new-path-advanced">
                                    <div className="form-group">
                                        <label>Repo path:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="trips/yorkshire/2017-09-15-yorkshire.md"
                                            onChange={e => {
                                                this.setPath(e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                    </div>
                )}
                <div className="form-group">
                    <label>Commit message:</label>
                    <input
                        id="commit-message"
                        placeholder="Type a short description of your changes (mandatory)"
                        className="form-control"
                        onChange={e => {
                            this.setCommitMessage(e.target.value);
                        }}
                    />
                </div>
                <div className="form-group">
                    <button
                        id="submit-button"
                        className="form-control"
                        onClick={this.submit}
                        disabled={!this.state.valid}>
                        Submit
                    </button>
                </div>
            </div>
        );
    }
}
