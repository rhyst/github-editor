import * as React from "react";
import { observer, inject } from "mobx-react";
import AppState, { StatusEnum } from "../stores/AppState";

declare interface Props {
    appState?: AppState;
}

declare interface State {
    selectedType: "file" | "dir" | null;
    gettingNewFiles: boolean;
    currentPath: string;
    initialLoad: boolean;
    selectDepth: number;
}

@inject("appState")
@observer
export class FileSelector extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const filePath = this.props.appState.filePath.split('/');        
        this.state = {
            selectedType: null,
            gettingNewFiles: false,
            currentPath: 'content',
            selectDepth: filePath.length,
            initialLoad: true
        };
        if (this.props.appState.fileStructure.length === 0) {
            filePath.forEach((f, i) => {
            this.props.appState.getFolder(filePath.slice(0,i).join('/'))
            })
        }
    }

    componentDidMount() {
        if (this.state.initialLoad && this.state.selectDepth === this.props.appState.fileStructure.length) {
            this.setState({initialLoad: false});
        }
        const selType = (document.getElementById('last-file-select') as HTMLSelectElement).selectedOptions[0].dataset.type;
        const button = document.getElementById('new-file-select-submit') as HTMLButtonElement;
        button.disabled = selType !== "file";
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (this.state.initialLoad && this.state.selectDepth === this.props.appState.fileStructure.length) {
            this.setState({initialLoad: false});
        }
        const selType = (document.getElementById('last-file-select') as HTMLSelectElement).selectedOptions[0].dataset.type;
        const button = document.getElementById('new-file-select-submit') as HTMLButtonElement;
        button.disabled = selType !== "file";
    }

    selectionMade = (e: any) => {
        const type = e.target.selectedOptions[0].dataset.type;
        if (type === "dir") {
            this.setState({ selectedType: "dir", gettingNewFiles: true, currentPath: e.target.value });          
            this.props.appState.trimFileStructure(
                parseInt(e.target.dataset.id)
            );
            this.props.appState.getFolder(e.target.value);
            this.setState({selectDepth: e.target.value.split('/').length + 1});                    
        } else {
            console.log(e.target.value);
            this.setState({ selectedType: "file",  gettingNewFiles: false, currentPath: e.target.value  });
            this.setState({selectDepth: e.target.value.split('/').length});        
            
        }
    };

    submit = () => {
        window.location.href = window.location.origin + window.location.pathname + "?state=" + (document.getElementById('last-file-select') as HTMLSelectElement).selectedOptions[0].value
    }

    render() {
        const { fileStructure } = this.props.appState;
        const numLeft = this.state.selectDepth - this.props.appState.fileStructure.length;
        let loadingSelects = []
        for (let i = 0; i < numLeft; i++) {
            if (i === numLeft - 1) {
                loadingSelects.push(<select id="last-file-select" key={i} disabled={true} className="form-control"><option>loading</option></select>)                
            } else {
                loadingSelects.push(<select key={i} disabled={true} className="form-control"><option>loading</option></select>)
            }
        }
        return (
            <div className="form-inline">
                {fileStructure.map((f, i) => {
                    const id =
                        i === fileStructure.length - 1
                            ? "last-file-select"
                            : "";
                    let selectedValue: string = this.props.appState.filePath.split('/')[i];
                    // Reverse order of trips selector so newest are at top
                    const fs = f[0] && f[0].path.split('/').indexOf('trip') === 1 && f[0].path.split('/').length > 3 ? f.reverse() : f;
                    return (
                        <select
                            id={id}
                            key={i}
                            data-id={i}
                            onChange={this.selectionMade}
                            disabled={this.state.initialLoad}
                            style={this.props.appState.isMobile ? {width: 'fit-content'}: {}}
                            className="form-control form-control-sm">
                            {fs.map((o: any) => (
                                <option
                                    key={o.path}
                                    value={o.path}
                                    data-type={o.type}
                                    selected={o.name === selectedValue}>
                                    {o.name}
                                </option>
                            ))}
                        </select>
                    );
                })}
                { loadingSelects }
                <button id="new-file-select-submit" className="btn btn-default" onClick={this.submit} style={this.props.appState.isMobile ? {marginTop: '5px'} : {}}>Submit</button>
            </div>
        );
    }
}
