import React, {useEffect, useState} from "react";

import {Redirect} from "react-router-dom";
import {
    Alert,
    Button,
    Container,
    Form,
    FormCheck,
    FormControl,
    FormGroup,
    FormLabel,
    Image,
    Row,
} from "react-bootstrap";

import {GetToken} from "../Tokens";
import Navigation from "./Navigation";
import WithServices from "./WithService";

const ChangeProfile = ({Service}) => {

    const [redirect, setRedirect] = useState(false);
    const [data, setData] = useState({});
    const [show, setShow] = useState(false);

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

    const uploadAvatar = async (event) => {
        event.preventDefault();

        document.querySelector('#btn-avatar').style.opacity = '0';

        const data = new FormData();
        data.append('avatar', document.querySelector('input[name="avatar"]').files[0])

        await Service.uploadAvatar(data, GetToken())
            .then(res => {
                document.querySelector('input[name="avatar"]').style.border = '1px solid #ced4da';

                if (res.detail) {
                    setShow(true);
                    document.querySelector('#error').textContent = res.detail;
                    document.querySelector('input[name="avatar"]').style.border = '1px solid #e50707';
                } else {
                    setData(res);
                }

            })
            .catch(error => console.log(error));

        document.querySelector('#btn-avatar').style.opacity = '1';
        document.querySelector('input[name="avatar"]').value = null;
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

                <Row className="mt-5">
                    <div className="col-md-2"/>

                    <Form className="text-center col-md-8" onSubmit={uploadAvatar} encType="multipart/form-data">

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

                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Avatar<span className="required">*</span></Form.Label>
                            <Form.Control required name="avatar" type="file"/>
                            <h3 className="mt-3">Current avatar</h3>
                            {
                                data.avatar ? (
                                    <Image className="avatar-big" src={`http://localhost:8000/api/v1/${data.avatar}`} rounded/>
                                ) : null
                            }
                        </Form.Group>

                        <Button id="btn-avatar" className="mt-3" variant="success" type="submit">
                            Upload avatar
                        </Button>

                    </Form>

                </Row>
            </Container>
        </>
    );

};


export default WithServices()(ChangeProfile);
