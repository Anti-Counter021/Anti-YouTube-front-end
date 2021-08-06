import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";

import App from './App';
import store from "./store";
import Services from "./Services";
import ErrorBoundary from "./components/ErrorBoundary";
import ServicesContext from "./components/ServicesContext";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.scss";

const Service = new Services();

ReactDOM.render(
    <Provider store={store}>
        <ErrorBoundary>
            <ServicesContext.Provider value={Service}>
                <Router>
                    <App/>
                </Router>
            </ServicesContext.Provider>
        </ErrorBoundary>
    </Provider>,
    document.getElementById('root')
);
