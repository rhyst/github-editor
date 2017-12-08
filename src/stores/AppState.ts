import { observable, action, computed } from "mobx";
import { asyncAction } from "mobx-utils";
import axios from "axios";
import * as utf8 from "utf8";

declare const CLIENTID: any;
declare const GITHUBAPIURL: any;
declare const GITHUBAUTHURL: any;
declare const GATEKEEPERURL: any;
declare const RELAYURL: any;
declare const REPOURL: any;
declare const REPOID: any;
declare const INSTALLATIONID: any;
declare const REDIRECTURL: any;
declare const DEVTOKEN: any;
declare const DEVELOPMENT: any;
declare const VALIDATIONLOCATION: any;

// Status of the App
export enum StatusEnum {
    Authenticating,
    AuthenticationFailed,
    CheckingPermission,
    PermissionFailed,
    LoadingContent,
    LoadingFailed,
    Loaded,
    Submitting,
    SubmittingFailed,
    Submitted
}

// Small viewport current screen
export enum ScreenEnum {
    Selector,
    Editor,
    Preview,
    Warnings,
    Commit,
    Help
}

class AppState {
    @observable status = StatusEnum.Authenticating;
    @observable isNewContent = true;
    @observable content = "";
    @observable filePath = "";
    @observable fileSha = "";
    @observable token = "";
    @observable state = "";
    @observable code = "";
    @observable fileStructure: any[] = [];
    @observable warnings: any[] = [];
    @observable isMobile: boolean = true;
    @observable screen: ScreenEnum = ScreenEnum.Editor;
    
    @computed
    get isLoading() {
        return this.status !== StatusEnum.Loaded;
    }

    @asyncAction
    *initiliase() {
        // Set screen size flag
        this.isMobile = document.documentElement.clientWidth < 768;    

        // Get url params
        const code = extractParam(document.location.search, "code");
        this.code = code ? code : "";
        const state = extractParam(document.location.search, "state");
        this.state = state ? state : "new";

        // Get stored api token if there is one
        let storedToken;
        if (!DEVELOPMENT) {
            storedToken = localStorage.getItem("editor-token");
        } else {
            storedToken = DEVTOKEN;
        }
        if (storedToken) {
            // If we have a token, check if it's unexpired and has permissions
            this.token = storedToken;
            yield this.checkToken();
        } else {
            yield this.getNewToken();
        }
    }

    @asyncAction
    *checkToken() {
        // Get a list of installations the user token has access to
        // Don't do anything with it, just to check if token works
        const response = yield axios.get(GITHUBAPIURL + '/user/installations', {
            headers: {
                Authorization: "token " + this.token,
                "Content-Type": "application/json",
                'Accept': 'application/vnd.github.machine-man-preview+json'
            },
            validateStatus: status => true
        });
        if (response.status === 200) {
            // If the token works, check the permissions
            console.log("Good token");
            this.status = StatusEnum.CheckingPermission;
            yield this.checkPermission();
        } else {
            // If the token doesn't work, remove it from local storage
            // Display failure message
            this.status = StatusEnum.AuthenticationFailed;
            localStorage.removeItem("editor-token");
            console.log("Bad token");
        }
    }

    @asyncAction
    *getNewToken() {
        if (this.code && this.state) {
            // We have a code and therefore are authed with github
            // Remove code from url (allows refreshing)
            history.replaceState(
                {},
                document.title,
                window.location.search
                    .replace(/code=[\w-]+/, "")
                    .replace("&state", "state")
            );
            // Send off code to gatekeeper service. This combines codes with oauth secret key to get us a session token
            const response = yield axios.get(GATEKEEPERURL + "/" + this.code);
            if (response.status === 200) {
                // Gatekeeper has successfully acquired a token for us so continue
                console.log("Token acquired");
                this.token = response.data.token;
                localStorage.setItem('editor-token', this.token);
                this.status = StatusEnum.CheckingPermission;                
                yield this.checkPermission();                
            } else {
                // Gatekeeper failed to get us a token
                console.log("Something went wrong when acquiring a token from gatekeeper", response)
                this.status = StatusEnum.AuthenticationFailed;                
            }
        } else if (this.state) {
            // No code therefore do redirect auth
            window.location.href =
                GITHUBAUTHURL +
                "?client_id=" +
                CLIENTID +
                "&redirect_uri=" +
                REDIRECTURL +
                "&state=" +
                decodeURIComponent(this.state) +
                "&allow_signup=false&scope=public_repo";
        }
    }

    @asyncAction
    *checkPermission() {
        // Get the specific installation we want
        const installationId = INSTALLATIONID;
        const response = yield axios.get(GITHUBAPIURL + "/user/installations/" + installationId.toString() + "/repositories", {
            headers: {
                Authorization: "token " + this.token,
                "Content-Type": "application/json",
                'Accept': 'application/vnd.github.machine-man-preview+json'
            },
            validateStatus: status => true
        });
        const repos = response.data.repositories;
        const repo = repos.find((r: any) => r.id === REPOID);

        // Check the tokens permissions on that installation
        if (repo !== undefined && repo.permissions.push) {
            // If we have permission then select between
            // two modes, new file and existing file
            if (this.state === "new") {
                // If new file then we don't need to load anything else
                this.status = StatusEnum.Loaded;
                this.isNewContent = true;
                // Some default text for the text box
                this.content =
                    'Title: Yorkshire I\nDate: 2017-09-15\nLocation: yorkshire\nSummary: A summary.\nType: trip\nPhotoarchive:\nMainimg: DSC06787.jpg\nThumbl: DSC06785--thumb.jpg\nThumbr: DSC06768--thumb.jpg\nAuthors:Caver A, Caver B\nCavepeeps: DATE=2000-01-01; CAVE=A Cave > B Cave; PEOPLE=Caver A, Caver B, Caver C;\n           DATE=2000-01-02; CAVE=C Cave; PEOPLE=Caver A, Caver B, Caver C;\nStatus: draft\n\n{{ mainimg }}\n{{ photolink }}\n##### {{ allpeople }}\n\n## Saturday\n\n### A Cave to B Cave: {{ DATE=2000-01-01; CAVE=A Cave > B Cave; }}\n\n{"A description of the image." left}(DSC06733.jpg)\n\n{"A description of the image." right}(DSC06733.jpg)\n\n{"A description of the image." center}(DSC06733.jpg)\n\nA trip report\n\n#### A Caver\n\n## Sunday\n\n### C Cave: {{ DATE=2000-01-02; CAVE=C Cave; }}\n\nA trip report\n\n#### A Caver\n\n';
            } else {
                // If existing file then load the contents
                this.status = StatusEnum.LoadingContent;
                this.isNewContent = false;
                yield this.getContent();
            }
        } else {
            console.log("User does not have edit permission on repository");
            this.status = StatusEnum.PermissionFailed;            
        }
    }

    @asyncAction
    *getContent() {
        // Get the contents of the file
        // This is done via the 'relay' server which has our app token
        // Installation tokens cannot 'get' file contents
        const response = yield axios.post(
            RELAYURL,
            {
                url: decodeURIComponent(this.state.replace("+", "%20")),
                token: this.token
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                validateStatus: status => true
            }
        );
        if (response.status === 200) {
            // If we get a good response, decode the contents
            // and display it
            console.log("Got file");
            this.content = utf8.decode(atob(response.data.content));
            this.fileSha = response.data.sha;
            this.filePath = response.data.path;
            this.status = StatusEnum.Loaded;
            this.generateWarnings()
        } else {
            this.status = StatusEnum.LoadingFailed;
            console.log("Failed to get file");
        }
    }

    @action.bound
    setStatus = (status: StatusEnum) => {
        this.status = status;
    };

    @action.bound
    setContent = (content: string) => {
        this.content = content;
        // Run some custom validation on the markdown
        // and diaply informational messages
        this.generateWarnings();
    };

    @asyncAction
    *submitContent(path: string, commitMessage: string) {
        if (!path) {
            path = this.filePath;
        }
        this.status = StatusEnum.Submitting;
	try {
            const response = yield axios.put(
                GITHUBAPIURL + REPOURL + "/" + path,
                {
                    message: commitMessage,
                    content: btoa(utf8.encode(this.content)),
                    path: path,
                    sha: this.isNewContent ? undefined : this.fileSha
                },
                {
                    headers: {
                        Authorization: "token " + this.token,
                        "Content-Type": "application/json"
                        },
                    validateStatus: status => true
                });
            if (response.status === 200 || response.status === 201) {
                history.pushState(
                    {},
                    document.title,
                    window.location.pathname + "?state=" + path
                );
                this.status = StatusEnum.Submitted;
                this.isNewContent = false;
                console.log("Success!");
            } else {
                console.log("Bad response");
                throw response;
             }
        } catch (e) {
            console.log(e);
            this.status = StatusEnum.SubmittingFailed;        
        }
    }

    @action.bound
    trimFileStructure = (currentIndex: number) => {
        // When a user selects a parent directory then we remove the children
        const newStructure =  this.fileStructure;
        if (newStructure.length > currentIndex + 1) {
            newStructure.splice(currentIndex + 1);
        }
        this.fileStructure = newStructure;

    };

    @action.bound
    setFileStructure = (fileStructure: any[]) => {
        // File structure is where we keep track of our file selector state
        const newStructure =  this.fileStructure;
        newStructure.push(fileStructure);
        this.fileStructure = newStructure;
    };

    @asyncAction
    *getFolder(pathToGet: string) {
        // List the contents of a folder to use on the file selector
        const response = yield axios.post(
            RELAYURL,
            {
                url: pathToGet,
                token: this.token
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                validateStatus: status => true
            }
        );
        if (response.status === 200 || response.status === 201) {
            this.setFileStructure(response.data);
        } else {
            console.log("Failure!");
        }    
    }

    @action.bound
    generateWarnings() {
        // Validator should return an array of objects
        // [{status: "danger", errorText: "Some error text"}, {status: "warning", errorText: "Some error text"}]
        // status is in this case is used to set the colour on the text (bootstrap text colouring)
        // errorText is the text that will be displayed in the warnings text box
        if (VALIDATIONLOCATION) {
            const validator = require(VALIDATIONLOCATION);
            this.warnings = validator(this.content);
        }
    }

    @action.bound
    setIsMobile(val: boolean) {
        this.isMobile = val;
    }

    @action.bound
    changeScreen(val: ScreenEnum) {
        // On small viewports we switch between different screens
        this.screen = val;
    }
}

export default AppState;

/** Extract parameters from the url */
function extractParam(search: string, key: string): string {
    let match: string;
    search.split("&").forEach(function(param) {
        var split = param.split("=");
        if (split[0].replace("?", "") === key) {
            (match as any) = split[1];
        }
    });
    return match;
}
