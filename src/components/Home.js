import React, {useEffect, useState} from "react";

import {Container, Row} from "react-bootstrap";

import Error from "./Error";
import Loading from "./Loading";
import VideoCard from "./VideoCard";
import Navigation from "./Navigation";
import WithServices from "./WithService";
import {VideoAuthor, VideoCategory} from "./VideoCardComponents";


const Home = ({Service}) => {

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(async () => {
        setLoading(true);
        await Service.videos()
            .then(res => {
                setVideos(res);
                setLoading(false);
            })
            .catch(error => setError(true));
    }, []);

    if (loading) {
        return (<Loading/>);
    }

    if (error) {
        return (<Error/>);
    }

    return (
        <>
            <Navigation/>
            <Container>
                <h1 className="text-center">Home page</h1>
                <Row>
                    {
                        videos.length ? (
                            videos.map(
                                video => (
                                    <VideoCard
                                        key={video.id}
                                        video={video}
                                        components={
                                            [
                                                <VideoAuthor key={`${video.id}-user`} user={video.user}/>,
                                                <VideoCategory key={`${video.id}-category`} category={video.category}/>,
                                            ]
                                        }
                                    />
                                )
                            )
                        ) : (
                            <h3 className="text-center">No video yet</h3>
                        )
                    }
                </Row>
            </Container>
        </>
    );

};

export default WithServices()(Home);
