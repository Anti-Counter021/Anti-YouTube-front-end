import React, {useEffect, useState} from "react";

import {Redirect} from "react-router-dom";
import {Button, Container, Form, FormCheck, FormControl, FormGroup, FormLabel, Row} from "react-bootstrap";

import {GetToken} from "../Tokens";
import Navigation from "./Navigation";
import WithServices from "./WithService";

const ChangeProfile = ({Service}) => {

    const [redirect, setRedirect] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        if (!GetToken()) {
            setRedirect(true);
        }
    });

    useEffect(() => {
        Service.getProfileChangeData(GetToken())
            .then(res => {
                setData(res);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    if (redirect) {
        return (<Redirect to='/login'/>);
    }

    const changeData = async (event) => {
        event.preventDefault();
        document.querySelector('#btn-change').style.opacity = '0';
        const data = Object.fromEntries(new FormData(event.target).entries());

        data.send_message = !!data.send_message;

        await Service.putProfileChangeData(GetToken(), data)
            .then(res => {
                setData(res);
            })
            .catch(error => {
                console.log(error);
            });

        document.querySelector('#btn-change').style.opacity = '1';
    }

    return (
        <>
            <Navigation/>
            <Container>
                <Row>
                    <div className="col-md-2"/>

                    <Form className="col-md-8 text-center" onSubmit={changeData}>

                        <FormGroup>
                            <FormLabel>About<span className="required">*</span></FormLabel>
                            <FormControl defaultValue={data.about} required name="about" type="text" placeholder="About"/>
                        </FormGroup>

                        <FormGroup className="text-start mt-3">
                            <FormCheck defaultChecked={data.send_message} name="send_message" type="checkbox" label="Send message?"/>
                        </FormGroup>

                        <Button id="btn-change" className="mt-3" variant="success" type="submit">
                            Change data
                        </Button>

                    </Form>
                </Row>
            </Container>
        </>
    );

};


export default WithServices()(ChangeProfile);
