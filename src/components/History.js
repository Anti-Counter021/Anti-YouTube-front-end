import React, {useEffect, useState} from "react";

import {Redirect} from "react-router-dom";
import {Container, Row} from "react-bootstrap";

import VideoCard from "./VideoCard";
import Navigation from "./Navigation";
import WithServices from "./WithService";
import {GetAccessToken, GetRefreshToken} from "../Tokens";
import {VideoAuthor, VideoCategory} from "./VideoCardComponents";

const History = ({Service}) => {

    const [redirect, setRedirect] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(async () => {
        if (!GetRefreshToken()) {
            setRedirect(true);
        } else {
            await Service.history(GetAccessToken())
                .then(res => setHistory(res))
                .catch(error => console.log(error));
        }
    }, []);

    if (redirect) {
        return (<Redirect to='/'/>);
    }

    return (
        <>
            <Navigation/>
            <Container>
                <Row>
                    <h1 className="text-center mt-3">History</h1>
                    {
                        history.length ? (
                            history.map(video => (
                                <VideoCard
                                    video={video}
                                    components={
                                        [<VideoAuthor user={video.user}/>, <VideoCategory category={video.category}/>]
                                    }
                                />
                            ))
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
