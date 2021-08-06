import React, {useEffect, useState} from "react";

import {Redirect} from "react-router-dom";
import {Alert, Button, Container, Form, FormControl, FormGroup, FormLabel, Row} from "react-bootstrap";

import {GetToken} from "../Tokens";
import Navigation from "./Navigation";
import WithService from "./WithService";


const ResetPasswordRequest = ({Service}) => {

    const [redirect, setRedirect] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (GetToken()) {
            setRedirect(true);
        }
    }, []);

    if (redirect) {
        return <Redirect to='/'/>
    }

    const resetPasswordRequest = async (event) => {
        event.preventDefault();

        document.querySelector('#btn-request-reset').style.opacity = '0';

        document.querySelector('[name="email"]').style.border = '1px solid #ced4da'

        const data = Object.fromEntries(new FormData(event.target).entries());

        await Service.resetPasswordRequest(data.email)
            .then(res => {
                if (res.detail) {
                    setShowError(true);
                    document.querySelector('#error').textContent = res.detail;
                    document.querySelector('[name="email"]').style.border = '1px solid #e50707';
                } else {
                    setShowSuccess(true);
                    document.querySelector('#success').textContent = res.msg;
                }
            })
            .catch(error => {
                console.log(error);
            });

        document.querySelector('#btn-request-reset').style.opacity = '1';
    }

    return (
        <>
            <Navigation/>

            <Container>
                <Row>
                    <div className="col-md-2"/>
                    <Form className="text-center col-md-8" onSubmit={resetPasswordRequest}>
                        <h1>Reset password Request</h1>

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
                            <FormLabel>Email address<span className="required">*</span></FormLabel>
                            <FormControl required name="email" type="email" placeholder="Enter email"/>
                        </FormGroup>

                        <Button id="btn-request-reset" className="mt-3" variant="success" type="submit">
                            Request reset password
                        </Button>

                    </Form>
                </Row>
            </Container>
        </>
    );

}

export default WithService()(ResetPasswordRequest);
