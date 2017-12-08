import * as React from "react";
import { observer, inject } from "mobx-react";
import AppState from "../stores/AppState";
import { toJS } from "mobx";

declare interface Props {
    appState?: AppState;
}

@inject("appState")
@observer
export class Help extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        return (
            <div>
                <h3>Markdown syntax cheat sheet</h3>
                <pre>
                    {
`#Title 
##Subtitle 
This is *italic* and this is **bold**.

This is a [link](http://www.example.com/) and this is an ![image](imagelink.jpg). 
                    
Write code with \`...\` or by adding a 4-whitespace indent to the paragraph. 

> This is a quote.
> And the quote continued
`}
</pre>
            </div>
        );
    }
}
