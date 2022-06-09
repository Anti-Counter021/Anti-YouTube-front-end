import React, {useState, useEffect} from "react";

import {Redirect, Link} from "react-router-dom";
import {
    Alert,
    Badge,
    Button,
    Container,
    Form,
    FormControl,
    FormGroup,
    FormLabel,
    FormSelect,
    Row
} from "react-bootstrap";

import Error from "./Error";
import Loading from "./Loading";
import Navigation from "./Navigation";
import WithServices from "./WithService";
import {GetAccessToken, GetRefreshToken} from "../Tokens";


const AddVideos = ({Service}) => {

    const [redirect, setRedirect] = useState(false);
    const [redirectVideo, setRedirectVideo] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(async () => {
        if (!GetRefreshToken()) {
            setRedirect(true);
        } else {
            setLoading(true);
            await Service.categories()
                .then(res => {
                    setCategories(res);
                    setLoading(false);
                })
                .catch(error => setError(true));
        }
    }, []);

    const [show, setShow] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    if (redirect) {
        return (<Redirect to='/'/>);
    }

    if (redirectVideo) {
        const href = document.querySelector('#go-to-video').getAttribute('data-redirect');
        return (<Redirect to={href}/>);
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

    const goToVideo = (event) => {
        event.preventDefault();
        if (event.target.getAttribute('data-redirect')) {
            setRedirectVideo(true);
        }
    };

    const addVideo = async (event) => {
        event.preventDefault();
        document.querySelector('#btn-video-add').style.opacity = '0';

        const data = new FormData(event.target);

        await Service.addVideo(data, GetAccessToken())
            .then(res => {
                document.querySelectorAll('input').forEach(
                    item => item.style.border = '1px solid #ced4da'
                );

                if (res.detail) {
                    setShow(true);
                    if (res.detail.indexOf('Video only format') + 1) {
                        document.querySelector('[name="video_file"]').style.border = '1px solid #e50707';
                    } else if (res.detail.indexOf('Preview only format') + 1) {
                        document.querySelector('[name="preview_file"]').style.border = '1px solid #e50707';
                    }
                    document.querySelector('#error').textContent = res.detail;
                } else {
                    setShowSuccess(true);
                    document.querySelector('#success').textContent = 'Video has been created';
                    document.querySelectorAll('input').forEach(
                        item => item.value = ''
                    );
                    document.querySelector('textarea').value = '';

                    const videoBtn = document.querySelector('#go-to-video');
                    videoBtn.setAttribute('data-redirect', `/videos/${res.id}`);
                    document.querySelector('.left-chars-input').textContent = '50';
                    document.querySelector('.left-chars-textarea').textContent = '50';
                    videoBtn.style.opacity = '1';
                }
            })
            .catch(error => console.log(error));

        document.querySelector('#btn-video-add').style.opacity = '1';
    }

    const leftChars = (event) => {
        const value = event.target.value;
        const counterLeft = event.target.parentElement.querySelector('.left-chars');
        counterLeft.textContent = event.target.maxLength - value.length;
    };

    return (
        <>
            <Navigation/>
            <Container>
                <Row>
                    <div className="col-md-2"/>

                    <Form className="col-md-8 text-center" onSubmit={addVideo}>

                        <h1 className="text-center">Add video</h1>

                        {
                            show ? (
                                <Alert variant="warning" onClose={() => setShow(false)}>
                                    <div className="d-flex justify-content-end">
                                        <Button
                                            onClick={() => setShow(false)}
                                            variant="warning"
                                            style={{color: "#000"}}
                                        >
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
                                        <Button
                                            onClick={() => setShowSuccess(false)}
                                            variant="success"
                                            style={{color: "#000"}}
                                        >
                                            X
                                        </Button>
                                    </div>
                                    <p id="success"/>
                                </Alert>
                            ) : null
                        }

                        <FormGroup>
                            <FormLabel>Title<span className="required">*</span></FormLabel>
                            <FormControl
                                maxLength="50"
                                required
                                name="title"
                                type="text"
                                placeholder="Enter title"
                                onChange={leftChars}
                            />
                            <Badge pill bg="success" className="left-chars left-chars-input">
                                50
                            </Badge>
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Description<span className="required">*</span></FormLabel>
                            <FormControl
                                as="textarea"
                                maxLength="500"
                                required
                                name="description"
                                type="text"
                                placeholder="Enter description"
                                onChange={leftChars}
                            />
                            <Badge pill bg="success" className="left-chars left-chars-textarea">
                                500
                            </Badge>
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Category<span className="required">*</span></FormLabel>
                            <FormSelect name="category_id" aria-label="Category">
                                {
                                    categories.map(({id, name}) => (
                                        <option value={id}>{name}</option>
                                    ))
                                }
                            </FormSelect>
                        </FormGroup>

                        <Form.Group controlId="formFile">
                            <Form.Label>Preview<span className="required">*</span></Form.Label>
                            <Form.Control required name="preview_file" type="file"/>
                        </Form.Group>

                        <Form.Group controlId="formFile">
                            <Form.Label>Video<span className="required">*</span></Form.Label>
                            <Form.Control required name="video_file" type="file"/>
                        </Form.Group>

                        <Button id="btn-video-add" className="mt-3" variant="success" type="submit">
                            Add
                        </Button>

                        <br/>

                        <Button
                            onClick={goToVideo}
                            style={{opacity: '0'}}
                            data-redirect=""
                            id="go-to-video"
                            className="btn btn-success text-center mt-3"
                        >
                            Go to video
                        </Button>

                    </Form>

                </Row>
            </Container>
        </>
    );

}

export default WithServices()(AddVideos);
