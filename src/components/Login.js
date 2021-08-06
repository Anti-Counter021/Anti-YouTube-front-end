import React, {useEffect, useState} from "react";

import {Redirect} from "react-router-dom";
import {Form, FormGroup, Container, Row, FormLabel, FormControl, Button, Alert} from "react-bootstrap";

import Navigation from "./Navigation";
import WithServices from "./WithService";
import {GetToken, setToken} from "../Tokens";


const Login = ({Service}) => {

    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (GetToken()) {
            setRedirect(true);
        }
    }, []);

    const [show, setShow] = useState(false);

    if (redirect) {
        return (<Redirect to='/'/>);
    }

    const login = async (event) => {
        event.preventDefault();
        document.querySelector('#btn-login').style.opacity = '0';

        const data = Object.fromEntries(new FormData(event.target).entries());

        await Service.login(data)
            .then(res => {
                if (res.detail) {
                    setShow(true);
                    document.querySelector('#error').textContent = res.detail;
                } else {
                    setToken(res.access_token);
                    window.location.href = '/';
                }
            })
            .catch(error => {
                console.log(error);
            });

        document.querySelector('#btn-login').style.opacity = '1';
    }

    return (
        <>
            <Navigation/>
            <Container>
                <Row className="mt-3">
                    <div className="col-md-2"/>

                    <Form className="col-md-8 text-center" onSubmit={login}>

                        <h1>Login</h1>

                        {
                            show ? (
                                <Alert variant="warning" onClose={() => setShow(false)}>
                                    <div className="d-flex justify-content-end">
                                        <Button onClick={() => setShow(false)} variant="warning" style={{color: "#000"}}>
                                            X
                                        </Button>
                                    </div>
                                    <p id="error"/>
                                </Alert>
                            ) : null
                        }

                        <FormGroup>
                            <FormLabel>Username<span className="required">*</span></FormLabel>
                            <FormControl required name="username" type="text" placeholder="Enter username"/>
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Password<span className="required">*</span></FormLabel>
                            <FormControl required name="password" type="password" placeholder="Password"/>
                        </FormGroup>

                        <Button id="btn-login" className="mt-3" variant="success" type="submit">
                            Login
                        </Button>

                    </Form>
                </Row>
            </Container>
        </>
    );

};


export default WithServices()(Login);
