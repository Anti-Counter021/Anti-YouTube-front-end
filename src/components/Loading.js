import React from "react";

import Navigation from "./Navigation";

import {ReactComponent as Spinner} from "../images/spinner.svg";

const Loading = () => {

    return (
        <>
            <Navigation/>
            <div className="text-center"><Spinner/></div>
        </>
    );

};

export default Loading;
