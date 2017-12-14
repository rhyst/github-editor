# Github Editor

A web based text editor that allows you to edit the text of markdown files in a Github repository by interacting with the Github Apps api. Built with React and MobX.

I wanted a way for less tech savvy users to be able to edit the content on a static web site that has its source files in a github repo. This accomplishes that somewhat.

## Features:

- Authenticates users with Github OAuth to ensure they have read/write access
- Live preview panel
- Easy to add validation functions and show warnings
- Easy to add markdown functions to modify the preview (useful if you have custom markdown plugins)
- File selector
- Responsive

## Prerequisites

- A Github App
- Github App is installed on repository and user has access to repository
- [Some server side application to relay certain requests](https://github.com/rhyst/github-relay) (for authentication and certain API endpoints)

## Limitations

- Requirement for server running relay code. 
    - To authenticate we must use our Github Apps secret key and we can't put that in the client side code.
    - Certain endpoints are not available with user token that we use in the client side code so we must relay requests to the server where we can use an App token (again something we don't want to have in the client side code)
- The preview currently only works for markdown  

## To do

 - Could integrate Gatekeeper like code into my own [relay](https://github.com/rhyst/github-relay) code rather than having two seperate applications.

## Instructions

### Install

1. Install yarn
2. In repo `yarn install`

### Configuration

By default the app will look for a `config.js` file in the root of the repo. To change the location of the config file you need to edit `configLocation` in 
`webpack.common.js`.

The config file should contain:

```javacript
module.exports = {
    CLIENTID: "",                                                     // client ID of your Github App
    GITHUBAPIURL: "https://api.github.com",                           // Github API URL
    GITHUBAUTHURL: "https://github.com/login/oauth/authorize",        // Github OAuth URL
    GATEKEEPERURL: "",                                                // URL of your token exchange relay (gatekeeper is one library to do this)
    RELAYURL: "",                                                     // URL of your API repo contents get request relay
    REPOURL: "/repos/myorgname/myreponame/contents",                  // URL path to repo contents
    REPOID: 1234567,                                                  // ID of the repository you want to edit
    INSTALLATIONID: 12345,                                            // ID of the Github App installation on the repository
    REDIRECTURL: "",                                                  // URL of the application
    DEVTOKEN: "",                                                     // Token for use during development so you don't have to change redirect url to localhost
    MARKDOWNFUNCTIONLOCATION: __dirname + "/mymarkdownfunctions.ts",  // File containing array of functions to applied to the markdown source to change it before it is 
previewed
    VALIDATONLOCATION: __dirname + "/myvalidator.ts"                  // File containing array of functions to applied to the markdown source to generate warnings and 
errors
}
```

### Build

To run a webpack dev server:

    yarn run start

To build a production version:

    yarn run build

Which will output the necessary files to `./dist`

### Deploy

Serve the contents of `./dist` on your web server.

### Other things to set up

1. Github Gatekeeper to relay authentication requests from your app. Roll your own or deploy [https://github.com/prose/gatekeeper] on your server and point `GATEKEEPERURL` 
at it.
2. Relay for get requests. Roll your own or [use the one I made](https://github.com/rhyst/github-relay).
3. Github App created and installed on a repository. Instructions [here](https://developer.github.com/apps/building-github-apps/creating-a-github-app/) but to summarise:
    1. In your Github Profile (or an org's settings), go to Developer Settings -> Github Apps -> [New Github App](https://github.com/settings/apps/new)
    2. Fill out the fields the important ones being:
        - `User authorization callback URL` this must be the same as `REDIRECTURL` and should be the url to the application (whereever you've hosted the built files)
        - `Permissions` You need `Read & Write` on `Repository content`
    3. Save the App
    4. On the App settings page there should be the option to `Install App`. Click that and install it onto whatever repository you want to be able to edit.
    5. Make note of the `Client Id` on the App. On the repository make note of the `Repository ID`, path to the repo contents, and the `installation ID` of the installed 
app. These are need for the config file.
