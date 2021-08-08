import React, {useState, useEffect} from "react";

import Navigation from "./Navigation";
import WithServices from "./WithService";
import {GetAccessToken, GetRefreshToken} from "../Tokens";


const AddVideos = () => {

    return (
        <>
            <Navigation/>
        </>
    );

}

export default WithServices()(AddVideos);
