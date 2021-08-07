import React, {useEffect, useState} from "react";

import {Link} from "react-router-dom";
import NavbarToggle from "react-bootstrap/NavbarToggle";
import NavbarCollapse from "react-bootstrap/NavbarCollapse";
import {Container, Nav, Navbar, NavbarBrand, NavDropdown, NavLink} from "react-bootstrap";

import WithServices from "./WithService";
import {deleteTokens, GetRefreshToken} from "../Tokens";

const Navigation = ({Service}) => {

    const [auth, setAuth] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (GetRefreshToken()) {
            setAuth(true);
        }
    });

    useEffect(async () => {
        await Service.categories()
            .then(res => setCategories(res))
            .catch(error => console.log(error));
    }, []);

    const logout = (event) => {
        event.preventDefault();
        deleteTokens();
        setAuth(false);
        window.location.href = '/';
    }

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <NavbarBrand>
                    <Link style={{color: '#000'}} className="link" to="/">FastAPI Anti-YouTube</Link>
                </NavbarBrand>
                <NavbarToggle aria-controls="basic-navbar-nav" />
                <NavbarCollapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink><Link className="link" to="/">Home</Link></NavLink>
                        <NavDropdown id="auth-dropdown" title="Auth">

                            {
                                !auth ? (
                                    <>
                                        <NavDropdown.Item>
                                            <Link className="link" to="/register">Registration</Link>
                                        </NavDropdown.Item>
                                        <NavDropdown.Item>
                                            <Link className="link" to="/login">Login</Link>
                                        </NavDropdown.Item>
                                        <NavDropdown.Item>
                                            <Link className="link" to="/request-password-reset">Reset password</Link>
                                        </NavDropdown.Item>
                                    </>
                                ) : (
                                    <>
                                        <NavDropdown.Item>
                                            <Link className="link" to="/profile/change">Change profile</Link>
                                        </NavDropdown.Item>
                                        <NavDropdown.Item>
                                            <span className="link" onClick={logout}>Logout</span>
                                        </NavDropdown.Item>
                                    </>
                                )
                            }

                        </NavDropdown>

                        <NavDropdown id="categories-dropdown" title="Categories">
                            {
                                categories ? (
                                    categories.map(({name, id}) => (
                                        <NavDropdown.Item key={id}>
                                            <Link className="link" to={`/categories/${id}`}>{name}</Link>
                                        </NavDropdown.Item>
                                    ))
                                ) : null
                            }
                        </NavDropdown>
                    </Nav>
                </NavbarCollapse>
            </Container>
        </Navbar>
    );

};

export default WithServices()(Navigation);
