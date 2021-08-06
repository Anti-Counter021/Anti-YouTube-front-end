import React, {useState} from "react";

import {Alert} from "react-bootstrap";
import {Redirect} from "react-router-dom";

import Navigation from "./Navigation";
import WithService from "./WithService";


const Activate = ({Service}) => {

    const [redirect, setRedirect] = useState(false);
    const [showError, setShowError] = useState(false);

    const token = window.location.search.substring(1).split('=')[1];

    if (redirect) {
        return (<Redirect to='/'/>)
    }

    Service.activate(token)
        .then(res => {
            if (res.detail) {
                setShowError(true);
                document.querySelector('#error').textContent = res.detail;
                setTimeout(() => {
                    setRedirect(true);
                }, 2000);
            } else {
                alert(res.msg);
                setRedirect(true);
            }
        })
        .catch(error => {
            console.log(error);
        });

    return (
        <>
            <Navigation/>
            {
                showError ? (
                    <Alert className="text-center" variant="warning" onClose={() => setShowError(false)}>
                        <p id="error"/>
                    </Alert>
                ) : null
            }
        </>
    )

};

export default WithService()(Activate);
