import React from 'react';
import ReactDOM from 'react-dom';

import {BrowserRouter as Router} from "react-router-dom";

import App from './App';
import Services from "./Services";
import ServicesContext from "./components/ServicesContext";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.scss";

const Service = new Services();

ReactDOM.render(
    <ServicesContext.Provider value={Service}>
        <Router>
            <App/>
        </Router>
    </ServicesContext.Provider>
    ,
    document.getElementById('root')
);
