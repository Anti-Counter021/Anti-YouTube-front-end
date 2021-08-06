import React from "react";

import ServicesContext from "./ServicesContext";


const WithServices = () => (Wrapped) => {

    return (props) => {
        return (
            <ServicesContext.Consumer>
                {
                    (Services) => {
                        return <Wrapped {...props} Service={Services}/>
                    }
                }
            </ServicesContext.Consumer>
        );
    };

};

export default WithServices
