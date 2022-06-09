import React from "react";

import {Redirect} from "react-router-dom";
import {Accordion, Container, Row} from "react-bootstrap";

import Navigation from "../Navigation";
import CategoryAdmin from "./CategoryAdmin";
import {GetRefreshToken, GetSuperuserBoolStatus} from "../../Tokens";

const Admin = () => {

    if (!GetRefreshToken() || !GetSuperuserBoolStatus()) {
        return (<Redirect to="/"/>);
    }

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
