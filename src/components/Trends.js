import React, {useEffect, useState} from "react";

import {Container, Row} from "react-bootstrap";

import Error from "./Error";
import Loading from "./Loading";
import VideoCard from "./VideoCard";
import Navigation from "./Navigation";
import WithServices from "./WithService";
import {VideoCategory, VideoAuthor} from "./VideoCardComponents";

const Trends = ({Service}) => {

    const [videos, setVideos] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(async () => {
        setLoading(true);
        await Service.trends()
            .then(res => {
                setVideos(res);
                setLoading(false);
            })
            .catch(error => setError(true));
    }, [])

    if (loading) {
        return (
            <>
                <Navigation/>
                <Loading/>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navigation/>
                <Error/>
            </>
        );
    }

    return (
        <>
            <Navigation/>
            <Container className="mt-5">
                <Row>
                    <h1 className="text-center">Trends</h1>
                    {
                        videos.length ? (
                            videos.map(video => (
                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    components={[
                                        <VideoAuthor user={video.user}/>,
                                        <VideoCategory category={video.category}/>,
                                    ]}
                                />
                            ))
                        ) : (
                            <h1 className="text-center">Not trends</h1>
                        )
                    }
                </Row>
            </Container>
        </>
    );

};

export default WithServices()(Trends);
