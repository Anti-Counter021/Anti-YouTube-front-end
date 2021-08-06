import React, {useEffect, useState} from "react";

import {Redirect} from "react-router-dom";
import {Form, FormGroup, Container, Row, FormLabel, FormControl, FormCheck, Button, Alert} from "react-bootstrap";

import {GetToken} from "../Tokens";
import Navigation from "./Navigation";
import WithService from "./WithService";

const Register = ({Service}) => {

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

    const registration = async (event) => {
        event.preventDefault();
        document.querySelector('#btn-register').style.opacity = '0';
        const data = Object.fromEntries(new FormData(event.target).entries());

        data.send_message = !!data.send_message;

        await Service.register(data)
            .then(res => {
                if (res.detail) {
                    setShow(true);
                    if (typeof res.detail === 'object') {
                       document.querySelector('#error').textContent = res.detail[0].msg;
                    } else {
                        document.querySelector('#error').textContent = res.detail;
                    }
                } else {
                    window.location.href = '/login';
                }
            })
            .catch(error => console.log(error));
        document.querySelector('#btn-register').style.opacity = '1';
    }

    return (
        <>
            <Navigation/>
            <Container>
                <Row className="mt-3">
                    <div className="col-md-2"/>

                    <Form className="col-md-8 text-center" onSubmit={registration}>

                        <h1>Registration</h1>

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
                            <FormLabel>Email address<span className="required">*</span></FormLabel>
                            <FormControl required name="email" type="email" placeholder="Enter email"/>
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>About<span className="required">*</span></FormLabel>
                            <FormControl required name="about" type="text" placeholder="About"/>
                        </FormGroup>

                        <FormGroup className="text-start mt-3">
                            <FormCheck defaultChecked={true} name="send_message" type="checkbox" label="Send message?"/>
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Password<span className="required">*</span></FormLabel>
                            <FormControl required name="password" type="password" placeholder="Password"/>
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Confirm password<span className="required">*</span></FormLabel>
                            <FormControl required name="confirm_password" type="password" placeholder="Confirm password"/>
                        </FormGroup>

                        <Button id="btn-register" className="mt-3" variant="success" type="submit">
                            Register
                        </Button>

                    </Form>
                </Row>
            </Container>
        </>
    );

}

export default WithService()(Register);
