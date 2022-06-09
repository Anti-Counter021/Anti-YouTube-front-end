import React from "react";

import {Redirect} from "react-router-dom";

import {setTokens} from "../Tokens";

const GoogleAuth = () => {

    const query = window.location.search.substring(1);

    const href = query.split('&');

    const data = {};
    href.map(item => {
        const param = item.split('=');
        data[param[0]] = param[1];
    });

    setTokens(data);

    return (
        <Redirect to="/"/>
    );

};

export default GoogleAuth;
