import React from "react";

import {Link} from "react-router-dom";
import {Accordion, Container, Row} from "react-bootstrap";

import Navigation from "../Navigation";

const Admin = () => {

    return (
        <>
            <Navigation/>
            <Container>
                <Row className="mt-3">
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Category</Accordion.Header>
                            <Accordion.Body>
                                <Link style={{color: '#000'}} to="/admin/categories" className="link">Category</Link>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Row>
            </Container>
        </>
    );

};

export default Admin;
