import React, {useEffect, useState} from "react";

import {Redirect} from "react-router-dom";
import {
    Alert, Badge,
    Button,
    Container,
    Form,
    FormCheck,
    FormControl,
    FormGroup,
    FormLabel,
    Image,
    Row,
    Modal
} from "react-bootstrap";

import Error from "./Error";
import Loading from "./Loading";
import {SITE} from "../Services";
import Navigation from "./Navigation";
import WithServices from "./WithService";
import ChangePassword from "./ChangePassword";
import {GetAccessToken, GetRefreshToken} from "../Tokens";

const ChangeProfile = ({Service}) => {

    const [redirect, setRedirect] = useState(false);
    const [data, setData] = useState({});
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [modal, setModal] = useState(false);
    const [QR_SRC, setQR_SRC] = useState('https://via.placeholder.com/150x150');

    useEffect(() => {
        if (!GetRefreshToken()) {
            setRedirect(true);
        }
    });

    useEffect(async () => {
        setLoading(true);
        await Service.getProfileChangeData(GetAccessToken())
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch(error => setError(true));
    }, []);

    if (redirect) {
        return (<Redirect to='/login'/>);
    }

    if (loading) {
       return (
            <>
                <Navigation/>
                <Loading/>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Navigation/>
                <Error/>
            </>
        )
    }

    const changeData = async (event) => {
        event.preventDefault();
        document.querySelector('#btn-change').style.opacity = '0';
        const data = Object.fromEntries(new FormData(event.target).entries());

        data.send_message = !!data.send_message;

        await Service.putProfileChangeData(GetAccessToken(), data)
            .then(res => {
                setData(res);
            })
            .catch(error => {
                console.log(error);
            });

        document.querySelector('#btn-change').style.opacity = '1';
    }

    const setStepAuth = async (event) => {
        event.preventDefault();
        document.querySelector('#btn-step').style.opacity = '0';

        await Service.toggleStepAuth(GetAccessToken())
            .then(res => {
                console.log(res)
                if (res.msg) {
                    if (res.msg.toLowerCase().indexOf('off') + 1) {
                        document.querySelector('[name="two_auth"]').checked = false;
                        document.querySelector('#btn-step').textContent = 'On';
                        document.querySelector('#btn-step').style.opacity = '1';
                    } else {
                        setQR_SRC(res.msg);
                        setModal(true);
                    }
                }
            })
            .catch(error => console.log(error));
    }

    const uploadAvatar = async (event) => {
        event.preventDefault();

        document.querySelector('#btn-avatar').style.opacity = '0';

        const data = new FormData();
        data.append('avatar', document.querySelector('input[name="avatar"]').files[0])

        await Service.uploadAvatar(data, GetAccessToken())
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

    const leftChars = (event) => {
        const value = event.target.value;
        const counterLeft = document.querySelector('#left-chars');
        counterLeft.textContent = event.target.maxLength - value.length;
    }

    if (modal) {
        return (
            <>
                <Navigation/>
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>QR code for google authenticator</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="text-center">
                        <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${QR_SRC}`}/>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={() => {
                            setModal(false);
                            setTimeout(() => {
                                document.querySelector('[name="two_auth"]').checked = true;
                                document.querySelector('#btn-step').textContent = 'Off';
                            }, 1000)
                        }} variant="secondary">Close</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </>
        );
    }

    return (
        <>
            <Navigation/>
            <Container>
                <Row>
                    <div className="col-md-2"/>

                    <Form className="col-md-8 text-center" onSubmit={changeData}>

                        <h2>Change data</h2>

                        <FormGroup>
                            <FormLabel>About<span className="required">*</span></FormLabel>
                            <FormControl
                                as="textarea"
                                maxLength="255"
                                defaultValue={data.about}
                                required
                                name="about"
                                type="text"
                                placeholder="About"
                                onChange={leftChars}
                            />&nbsp;
                            {
                                data.about ? (
                                    <>
                                        Chars left&nbsp;
                                        <Badge pill bg="success" id="left-chars">
                                            {255 - data.about.length}
                                        </Badge>
                                    </>
                                ) : (
                                    <>
                                        Chars left&nbsp;
                                        <Badge pill bg="success" id="left-chars">
                                            255
                                        </Badge>
                                    </>
                                )
                            }
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
                                    <Image className="avatar-big" src={`${SITE}${data.avatar}`} rounded/>
                                ) : (
                                    <Image className="avatar-big" src="https://via.placeholder.com/400x400" rounded/>
                                )
                            }
                        </Form.Group>

                        <Button id="btn-avatar" className="mt-3" variant="success" type="submit">
                            Upload avatar
                        </Button>

                    </Form>

                </Row>

                <Row className="mt-4">
                    <div className="col-md-2"/>
                    <ChangePassword/>
                </Row>

                <Row>
                    <div className="col-md-3"/>
                    <Form className="col-md-6 text-center" onSubmit={setStepAuth}>
                        <h2 className="text-center">2-step auth</h2>
                        <FormGroup className="text-start">
                            <FormCheck disabled="disabled" name="two_auth" defaultChecked={data.two_auth} type="checkbox" label="2-auth step?"/>
                        </FormGroup>

                        <Button id="btn-step" className="mb-3 mt-3 text-center" variant="success" type="submit">
                            {
                                data.two_auth ? (<>Off</>) : (<>On</>)
                            }
                        </Button>
                    </Form>
                </Row>
            </Container>
        </>
    );

};


export default WithServices()(ChangeProfile);
