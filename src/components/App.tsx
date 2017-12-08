import * as React from "react";
import * as ReactDOM from "react-dom";
import { observer, inject } from "mobx-react";
import * as showdown from "showdown";
import { Provider } from "mobx-react";

import AppState, { StatusEnum, ScreenEnum } from "../stores/AppState";
import {
    Loading,
    TextBox,
    SubmitControls,
    InputScreen,
    FileSelector,
    Warnings,
    Help
} from "./index";

import markdownProcessor from "../helper/markdown";

import * as styles from "../styles";

declare interface State {
    showHelp: boolean;
}

@inject("appState")
@observer
class App extends React.Component<{ appState?: AppState }, State> {
    constructor(props: { appState: AppState }) {
        super(props);
        this.props.appState.initiliase();
        this.state = {
            showHelp: false
        };
        window.addEventListener("resize", () =>
            this.props.appState.setIsMobile(
                document.documentElement.clientWidth < 768
            )
        );
    }

    preventAccidentalExit = (event: any) => {
        if (event.target.href) {
            event.preventDefault();
            if (
                confirm(
                    "You may lose uncommited work if you navigate away from the page. Leave the page?"
                )
            ) {
                window.location.href = event.target.href;
            }
        }
    };

    toggleHelp = () => {
        this.setState({ showHelp: !this.state.showHelp });
    };

    render() {
        const {
            isLoading,
            content,
            setContent,
            isMobile,
            screen,
            changeScreen
        } = this.props.appState;
        const converter = new showdown.Converter();
        let { metadata, body, error, errorText } = markdownProcessor(content);
        const bodyHTML = converter.makeHtml(body);

        return (
            <div>
                <Loading style={styles.cover} />
                <InputScreen style={styles.cover} />
                {!isLoading && (
                    <div>
                        {isMobile && (
                            <div className="row" style={styles.mobileButtons}>
                                <div className="col-xs-2 " style={{padding: "0 1px"}}>
                                    <button
                                        className={`btn btn-${screen ===
                                        ScreenEnum.Selector
                                            ? "success"
                                            : "info"}`}
                                        onClick={() =>
                                            changeScreen(ScreenEnum.Selector)}
                                            style={styles.mobileButton}>
                                        Selector
                                    </button>
                                </div>
                                <div className="col-xs-2 " style={{padding: "0 1px"}}>
                                    <button
                                        className={`btn btn-${screen ===
                                        ScreenEnum.Editor
                                            ? "success"
                                            : "info"}`}
                                        onClick={() =>
                                            changeScreen(ScreenEnum.Editor)}
                                            style={styles.mobileButton}>
                                        Editor
                                    </button>
                                </div>
                                <div className="col-xs-2 " style={{padding: "0 1px"}}>
                                    <button
                                        className={`btn btn-${screen ===
                                        ScreenEnum.Preview
                                            ? "success"
                                            : "info"}`}
                                        onClick={() =>
                                            changeScreen(ScreenEnum.Preview)}
                                            style={styles.mobileButton}>
                                        Preview
                                    </button>
                                </div>
                                <div className="col-xs-2 " style={{padding: "0 1px"}}>
                                    <button
                                        className={`btn btn-${screen ===
                                        ScreenEnum.Warnings
                                            ? "success"
                                            : "info"}`}
                                        onClick={() =>
                                            changeScreen(ScreenEnum.Warnings)}
                                            style={styles.mobileButton}>
                                        Warnings
                                    </button>
                                </div>
                                <div className="col-xs-2 " style={{padding: "0 1px"}}>
                                    <button
                                        className={`btn btn-${screen ===
                                        ScreenEnum.Commit
                                            ? "success"
                                            : "info"}`}
                                        onClick={() =>
                                            changeScreen(ScreenEnum.Commit)}
                                            style={styles.mobileButton}>
                                        Submit
                                    </button>
                                </div>
                                <div className="col-xs-2 " style={{padding: "0 1px"}}>
                                    <button
                                        className={`btn btn-${screen ===
                                        ScreenEnum.Help
                                            ? "success"
                                            : "info"}`}
                                        onClick={() =>
                                            changeScreen(ScreenEnum.Help)}
                                            style={styles.mobileButton}>
                                        Help
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="row">
                            {(!isMobile || screen === ScreenEnum.Editor) && (
                                <div
                                    className="col-xs-12 col-sm-6"
                                    style={isMobile ? styles.fullScreen : {}}>
                                    {!isMobile && <h3>Editor</h3>}
                                    <TextBox
                                        text={content}
                                        editable={true}
                                        onChange={setContent}
                                        style={
                                            isMobile
                                                ? { ...styles.textBoxTall, fontFamily: 'monospace'}
                                                : { ...styles.textBox, fontFamily: 'monospace'}
                                        }
                                    />
                                </div>
                            )}
                            {(!isMobile || screen === ScreenEnum.Preview) && (
                                <div
                                    className="col-xs-12 col-sm-6"
                                    style={isMobile ? styles.fullScreen : {}}>
                                    {!isMobile && <h3>Preview</h3>}
                                    <TextBox
                                        text={bodyHTML}
                                        editable={false}
                                        onClick={this.preventAccidentalExit}
                                        style={
                                            isMobile
                                                ? styles.textBoxTall
                                                : styles.textBox
                                        }
                                    />
                                </div>
                            )}
                        </div>
                        <div className="row">
                            {(!isMobile || screen === ScreenEnum.Warnings) && (
                                <div
                                    className="col-xs-12 col-sm-6 col-md-6"
                                    style={isMobile ? styles.fullScreen : {}}>
                                    <div className="panel panel-default">
                                        <div className="panel-heading">
                                            Warnings
                                        </div>
                                        <div className="panel-body">
                                            <Warnings />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(!isMobile || screen === ScreenEnum.Commit) && (
                                <div
                                    className="col-xs-12 col-sm-6 col-md-4"
                                    style={isMobile ? styles.fullScreen : {}}>
                                    <div className="panel panel-default">
                                        <div className="panel-heading">
                                            Commit
                                        </div>
                                        <div className="panel-body">
                                            <SubmitControls />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {(!isMobile || screen === ScreenEnum.Selector) && (
                            <div
                                className="row"
                                style={isMobile ? { ...styles.fullScreen, paddingLeft: '15px', paddingRight: '15px' } : {}}>
                                <div className="col-xs-12" style={styles.selector}>
                                {!isMobile && <h3>File selector</h3>}
                                    <FileSelector />
                                </div>
                            </div>
                        )}
                        { !isMobile &&
                        <div className="row" style={{paddingTop: '5px', paddingBottom: '5px'}}>
                            <div className="col-xs-12">
                                <button className="btn" onClick={this.toggleHelp}>
                                    {this.state.showHelp ? "Hide" : "Show"} help
                                </button>
                            </div>
                        </div>
                        }
                        {((!isMobile && this.state.showHelp) ||
                            screen === ScreenEnum.Help) && (
                            <div className="row">
                                <div
                                    className="col-xs-12"
                                    style={isMobile ? styles.fullScreen : {}}>
                                    <Help />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

class ProvidedApp extends React.Component {
    render() {
        return (
            <Provider appState={new AppState()}>
                <App />
            </Provider>
        );
    }
}

export default ProvidedApp;
