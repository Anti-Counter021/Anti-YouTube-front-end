import React, {Component} from "react";

import {Button, Container, Row, ProgressBar, Alert} from "react-bootstrap";

import Navigation from "./Navigation";
import WithServices from "./WithService";
import {GetAccessToken, GetRefreshToken} from "../Tokens";


class ExportData extends Component {

    componentDidMount() {
        if (!GetRefreshToken()) {
            window.location.href = '/login';
        }
    }

    state = {
        value: 0,
        show: true,
    }

    onMessage = (ev) => {
        const data = JSON.parse(ev.data);

        this.setState({
            value:`${data.progress}`
        });

        if (data.progress === 100) {
            const {ws, interval} = this.state;
            ws.close();
            clearInterval(interval);
            document.querySelector('#success').textContent = 'Check your email'
        }
    }

    progress = (id) => {
        const ws = new WebSocket('ws://localhost:8000/api/v1/auth/task-status');
        ws.onmessage = this.onMessage;
        this.setState({
            ws,
            interval: setInterval(() => ws.send(id), 1000),
            value: '0',
            show: false,
        });
    }

    exportData = async () => {
        const {Service} = this.props;
        await Service.exportDataRequest(GetAccessToken())
            .then(res => {
                this.progress(res.task_id);
            })
            .catch(error => console.log(error));
    }

    render() {

        return (
            <>
                <Navigation/>
                <Container className="mt-3">
                    <Row className="text-center">
                        <h1>Export data</h1>
                        {
                            this.state.show ? (
                                <Button variant="success" onClick={this.exportData}>Click</Button>
                            ) : (
                                <Alert variant="success">
                                    <p id="success">Loading...</p>
                                </Alert>
                            )
                        }
                        <h4 className="mt-2">Progress</h4>
                        <ProgressBar
                            animated
                            defaultValue={0}
                            label={`${this.state.value}%`}
                            now={this.state.value}
                            min={0}
                            max={100}
                        />
                    </Row>
                </Container>
            </>
        );

    }

}


export default WithServices()(ExportData);
