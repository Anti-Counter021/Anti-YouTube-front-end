import React, {useEffect, useState} from "react";

import {Link} from "react-router-dom";
import NavbarToggle from "react-bootstrap/NavbarToggle";
import NavbarCollapse from "react-bootstrap/NavbarCollapse";
import {Container, Nav, Navbar, NavbarBrand, NavDropdown, NavLink} from "react-bootstrap";

import WithServices from "./WithService";
import {deleteTokens, GetRefreshToken, GetSuperuserBoolStatus, GetUserId} from "../Tokens";

const Navigation = ({Service}) => {

    const [auth, setAuth] = useState(false);
    const [superuser, setSuperuser] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (GetRefreshToken()) {
            setAuth(true);
            setSuperuser(GetSuperuserBoolStatus());
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
        <>
            <Navbar bg="danger" variant="dark" expand="lg" fixed="top">
                <Container>
                    <NavbarBrand>
                        <Link style={{color: '#fff'}} to="/">FastAPI Anti-YouTube</Link>
                    </NavbarBrand>
                    <NavbarToggle aria-controls="basic-navbar-nav"/>
                    <NavbarCollapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavLink><Link className="link" to="/">Home</Link></NavLink>
                            <NavLink><Link className="link" to="/trends">Trends</Link></NavLink>
                            <NavDropdown id="auth-dropdown" title="Auth">

                                {
                                    !auth ? (
                                        <>
                                            <NavDropdown.Item>
                                                <Link to="/register">Registration</Link>
                                            </NavDropdown.Item>
                                            <NavDropdown.Item>
                                                <Link to="/login">Login</Link>
                                            </NavDropdown.Item>
                                            <NavDropdown.Item>
                                                <Link to="/request-password-reset">Reset password</Link>
                                            </NavDropdown.Item>
                                            <NavDropdown.Item>
                                                <Link to="/username">Get username</Link>
                                            </NavDropdown.Item>
                                        </>
                                    ) : (
                                        <>
                                            <NavDropdown.Item>
                                                <Link to="/history">History</Link>
                                            </NavDropdown.Item>
                                            <NavDropdown.Item>
                                                <span onClick={logout}>Logout</span>
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
                                                <Link to={`/categories/${id}`}>{name}</Link>
                                            </NavDropdown.Item>
                                        ))
                                    ) : null
                                }
                            </NavDropdown>

                            {
                                auth ? (
                                    <>
                                        <NavLink><Link className="link" to="/subscriptions">Subscriptions</Link></NavLink>
                                        {
                                            superuser ? (
                                                <NavLink><Link className="link" to="/admin">Admin</Link></NavLink>
                                            ) : null
                                        }
                                    </>
                                ) : null
                            }

                            <NavLink><Link className="link" to="/search"><i className="fas fa-search"/></Link></NavLink>

                        </Nav>
                    </NavbarCollapse>
                    {
                        auth ? (
                            <NavbarCollapse className="justify-content-end">
                                <NavLink>
                                    <Link className="link" to="/videos/add"><i className="fas fa-file-video"/></Link>
                                </NavLink>
                                <NavLink>
                                    <Link className="link" to="/profile/change"><i className="fas fa-id-card"/></Link>
                                </NavLink>
                                <NavLink>
                                    <Link className="link" to={`/channel/${GetUserId()}`}><i className="fas fa-user-circle"/></Link>
                                </NavLink>
                            </NavbarCollapse>
                        ) : null
                    }
                </Container>
            </Navbar>
            <br className="mt-4"/>
        </>
    );

};

export default WithServices()(Navigation);
