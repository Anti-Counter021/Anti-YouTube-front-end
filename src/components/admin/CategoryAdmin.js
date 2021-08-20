import React, {useState, useEffect} from "react";

import {Redirect} from "react-router-dom";
import {Container, Row, Accordion, FormGroup, FormLabel, FormControl, Form, Button, Alert} from "react-bootstrap";

import Error from "../Error";
import Loading from "../Loading";
import Navigation from "../Navigation";
import WithServices from "../WithService";
import {GetAccessToken, GetRefreshToken, GetSuperuserBoolStatus} from "../../Tokens";

const CategoryAdmin = ({Service}) => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const getCategories = async () => {
        setLoading(true);
        await Service.categories()
            .then(res => {
                setCategories(res);
                setLoading(false);
            })
            .catch(error => setError(true));
    }

    useEffect(async () => {
        await getCategories();
    }, []);

    if (!GetRefreshToken() || !GetSuperuserBoolStatus()) {
        console.log('fff')
        return (<Redirect to="/"/>);
    }

    const removeCategory = async (id) => {
        await Service.removeCategory(id, GetAccessToken())
            .then(async res => {
                await getCategories();
                setShowSuccess(true);
                document.querySelector('#success').textContent = res.msg;
            })
            .catch(error => setError(true));
    };

    if (loading) {
        return (
            <>
                <Navigation/>
                <Loading/>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navigation/>
                <Error/>
            </>
        );
    }

    const createCategory = async (event) => {
        event.preventDefault();

        const data = Object.fromEntries(new FormData(event.target).entries());

        await Service.createCategory(GetAccessToken(), data)
            .then(async res => {
                await getCategories();
                setShowSuccess(true);
                document.querySelector('#success').textContent = 'Category has been created';
            })
            .catch(error => setError(true));
    };

    const updateCategory = async (event, pk) => {
        event.preventDefault();

        const data = Object.fromEntries(new FormData(event.target).entries());

        await Service.updateCategory(pk, GetAccessToken(), data)
            .then(async res => {
                await getCategories();
                setShowSuccess(true);
                document.querySelector('#success').textContent = 'Category has been updated';
            })
            .catch(error => setError(true));
    }

    return (
        <>
            <Navigation/>
            <Container className="mt-3">
                <Row>
                    <h1 className="text-center">Categories</h1>

                    {
                        showSuccess ? (
                            <Alert variant="success" onClose={() => setShowSuccess(false)}>
                                <div className="d-flex justify-content-end">
                                    <Button onClick={() => setShowSuccess(false)} variant="success"
                                            style={{color: "#000"}}>
                                        X
                                    </Button>
                                </div>
                                <p id="success"/>
                            </Alert>
                        ) : null
                    }

                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Create category</Accordion.Header>
                            <Accordion.Body>
                                <Form onSubmit={createCategory}>
                                    <FormGroup>
                                        <FormLabel>Category name<span className="required">*</span></FormLabel>
                                        <FormControl placeholder="Category name" required name="name" type="text"/>
                                    </FormGroup>
                                    <Button className="mt-2" variant="success" type="submit">Create</Button>
                                </Form>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Row>

                <Row>
                    <div className="col-md-2"/>
                    <div className="col-md-8 mt-2">
                        {
                            categories.length ? (
                                categories.map(({id, name}) => (
                                    <>
                                        <Accordion>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header>
                                                    <div className="col-md-8 h4" key={id}>
                                                        {name}
                                                    </div>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    <Form
                                                        onSubmit={
                                                            (event) => updateCategory(
                                                                event, id
                                                            )
                                                        }
                                                    >
                                                        <FormGroup>
                                                            <FormLabel>
                                                                Category name<span className="required">*</span>
                                                            </FormLabel>
                                                            <FormControl
                                                                placeholder="Category name"
                                                                required
                                                                name="name"
                                                                defaultValue={name}
                                                                type="text"
                                                            />
                                                        </FormGroup>
                                                        <Button className="mt-2" variant="success" type="submit">
                                                            Update
                                                        </Button>
                                                        <div style={{float: 'right'}} className="mt-2">
                                                            <Button
                                                                style={{marginLeft: '3px'}}
                                                                onClick={() => removeCategory(id)}
                                                                variant="danger"
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </Form>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                    </>
                                ))
                            ) : (<h3 className="text-center">Categories not found</h3>)
                        }
                    </div>
                </Row>
            </Container>
        </>
    );

};

export default WithServices()(CategoryAdmin)
