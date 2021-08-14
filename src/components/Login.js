import React, {useEffect, useState} from "react";

import {Redirect} from "react-router-dom";
import {Form, FormGroup, Container, Row, FormLabel, FormControl, Button, Alert} from "react-bootstrap";

import Navigation from "./Navigation";
import WithServices from "./WithService";
import {GetRefreshToken, setTokens} from "../Tokens";


const Login = ({Service}) => {

    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (GetRefreshToken()) {
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

        const data = new FormData(event.target);

        await Service.login(data)
            .then(res => {

                document.querySelectorAll('input').forEach(
                    item => item.style.border = '1px solid #ced4da'
                );

                if (res.detail) {
                    setShow(true);
                    document.querySelector('#error').textContent = res.detail;

                    if (res.detail.toLowerCase().indexOf('user') + 1) {
                        document.querySelector('[name="username"]').style.border = '1px solid #e50707';
                    } else if (res.detail.toLowerCase().indexOf('password') + 1) {
                        document.querySelector('[name="password"]').style.border = '1px solid #e50707';
                    }
                } else {
                    setTokens(res);
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
