import React from "react";

import {Link} from "react-router-dom";
import {Accordion, Container, Row} from "react-bootstrap";

import Navigation from "../Navigation";
import CategoryAdmin from "./CategoryAdmin";

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
                                <CategoryAdmin/>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Row>
            </Container>
        </>
    );

};

export default Admin;
