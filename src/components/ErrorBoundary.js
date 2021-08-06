import React, {Component} from "react";

import Error from "./Error";

export default class ErrorBoundary extends Component {

    state = {
        error: false,
    }

    componentDidCatch(error, errorInfo) {
        this.setState({error: true});
    }

    render() {
        if (this.state.error) {
            return <Error/>
        }

        return this.props.children;
    }

}
