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
- A server to run relays (for authentication and certain API endpoints)

## Limitations

- Requirement for server running relay code. 
    - To authenticate we must use our Github Apps secret key and we can't put that in the client side code.
    - Certain endpoints are not available with user token that we use in the client side code so we must relay requests to the server where we can use an App token (again something we don't want to have in the client side code)
    - Relay code isn't hard to do but it is a TO DO to put my implementation on github
- The preview currently only works for markdown

## Instructions

TO DO