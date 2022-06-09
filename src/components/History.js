import React, {useEffect, useState} from "react";

import {Redirect} from "react-router-dom";
import {Container, Row, Button, Alert} from "react-bootstrap";

import Error from "./Error";
import Loading from "./Loading";
import VideoCard from "./VideoCard";
import Navigation from "./Navigation";
import WithServices from "./WithService";
import {GetAccessToken, GetRefreshToken} from "../Tokens";
import {VideoAuthor, VideoCategory} from "./VideoCardComponents";

const History = ({Service}) => {

    const [redirect, setRedirect] = useState(false);
    const [history, setHistory] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const getHistory = async () => {
        setLoading(true);
        await Service.history(GetAccessToken())
            .then(res => {
                setHistory(res);
                setLoading(false);
            })
            .catch(error => console.log(error));
    }

    useEffect(async () => {
        if (!GetRefreshToken()) {
            setRedirect(true);
        } else {
            await getHistory();
        }
    }, []);

    if (redirect) {
        return (<Redirect to='/'/>);
    }

    const clearHistory = async (event) => {
        event.preventDefault();
        await Service.clearHistory(GetAccessToken())
            .then(async () => {
                setShow(true);
                await getHistory();
            })
            .catch(error => setError(true));
    }
    if (loading) {
       return (
            <>
                <Navigation/>
                <Loading/>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Navigation/>
                <Error/>
            </>
        )
    }

    return (
        <>
            <Navigation/>
            <Container>
                <Row>
                    <h1 className="text-center mt-3">History</h1>
                    {
                        show ? (
                            <Alert variant="success" onClose={() => setShow(false)}>
                                <div className="d-flex justify-content-end">
                                    <Button
                                        onClick={() => setShow(false)}
                                        variant="success"
                                        style={{color: "#000"}}
                                    >
                                        X
                                    </Button>
                                </div>
                                <p className="text-center" id="success">History has been cleared</p>
                            </Alert>
                        ) : null
                    }
                    {
                        history.length ? (
                            <>
                                <Row className="mb-5">
                                    <div className="col-md-2"/>
                                    <div className="col-md-8 text-center">
                                        <Button variant="danger" onClick={clearHistory}>
                                            Clear history
                                        </Button>
                                    </div>
                                </Row>
                                {
                                    history.map(video => (
                                        <VideoCard
                                            video={video}
                                            components={
                                                [
                                                    <VideoAuthor user={video.user}/>,
                                                    <VideoCategory category={video.category}/>,
                                                ]
                                            }
                                        />
                            ))
                                }
                            </>
                        ) : (
                            <h3 className="text-center">You haven't watched the video yet</h3>
                        )
                    }
                </Row>
            </Container>
        </>
    );

}

export default WithServices()(History);
