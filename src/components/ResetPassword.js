import React, {useState, useEffect} from "react";

import {Redirect} from "react-router-dom";
import {Alert, Button, Container, Form, FormControl, FormGroup, FormLabel, Row} from "react-bootstrap";

import {GetRefreshToken} from "../Tokens";
import Navigation from "./Navigation";
import WithServices from "./WithService";


const ResetPassword = ({Service}) => {

    const [redirect, setRedirect] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const token = window.location.search.substring(1).split('=')[1];

    useEffect(() => {
        if (GetRefreshToken()) {
            setRedirect(true);
        }
    });

    if (!token) {
        return (<Redirect to='/'/>);
    }

    if (redirect) {
        return (<Redirect to='/'/>);
    }

    const resetPassword = async (event) => {
        event.preventDefault();

        document.querySelector('#btn-reset-password').style.opacity = '0';

        document.querySelectorAll('input').forEach(
            item => item.style.border = '1px solid #ced4da'
        );

        const data = Object.fromEntries(new FormData(event.target).entries());

        await Service.resetPassword(data, token)
            .then(res => {
                if (res.msg) {
                    setShowSuccess(true);
                    document.querySelector('#success').textContent = res.msg;
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                } else if (res.detail) {
                    setShowError(true);

                    if (typeof res.detail === 'object') {
                        document.querySelector('#error').textContent = res.detail[0].msg;

                        if (res.detail[0].msg.toLowerCase().indexOf('not match') + 1) {
                            document.querySelector('[name="password"]').style.border = '1px solid #e50707';
                            document.querySelector('[name="confirm_password"]').style.border = '1px solid #e50707';
                        } else if (res.detail[0].msg.toLowerCase().indexOf('password') + 1) {
                            document.querySelector('[name="password"]').style.border = '1px solid #e50707';
                        }
                    } else {
                        document.querySelector('#error').textContent = res.detail;
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 1000);
                    }
                }
            })
            .catch(error => {
                console.log(error);
            });

        document.querySelector('#btn-reset-password').style.opacity = '1';
    }

    return (
        <>
            <Navigation/>
            <Container>
                <Row>
                    <div className="col-md-2"/>
                    <Form className="col-md-8 text-center" onSubmit={resetPassword}>

                        <h1>Reset password</h1>

                        {
                            showError ? (
                                <Alert variant="warning" onClose={() => setShowError(false)}>
                                    <div className="d-flex justify-content-end">
                                        <Button onClick={() => setShowError(false)} variant="warning" style={{color: "#000"}}>
                                            X
                                        </Button>
                                    </div>
                                    <p id="error"/>
                                </Alert>
                            ) : null
                        }

                        {
                            showSuccess ? (
                                <Alert variant="success" onClose={() => setShowSuccess(false)}>
                                    <div className="d-flex justify-content-end">
                                        <Button onClick={() => setShowSuccess(false)} variant="success" style={{color: "#000"}}>
                                            X
                                        </Button>
                                    </div>
                                    <p id="success"/>
                                </Alert>
                            ) : null
                        }

                        <FormGroup>
                            <FormLabel>Password<span className="required">*</span></FormLabel>
                            <FormControl required name="password" type="password" placeholder="Password"/>
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Confirm password<span className="required">*</span></FormLabel>
                            <FormControl required name="confirm_password" type="password" placeholder="Confirm password"/>
                        </FormGroup>

                        <Button id="btn-reset-password" className="mt-3" variant="success" type="submit">
                            Reset password
                        </Button>

                    </Form>
                </Row>
            </Container>
        </>
    );

};

export default WithServices()(ResetPassword);
