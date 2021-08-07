import React, {useEffect, useState} from "react";

import {Container, Row} from "react-bootstrap";

import VideoCard from "./VideoCard";
import Navigation from "./Navigation";
import WithServices from "./WithService";


const Home = ({Service}) => {

    const [videos, setVideos] = useState([]);

    useEffect(async () => {
        await Service.videos()
            .then(res => setVideos(res))
            .catch(error => console.log(error));
    }, []);

    return (
        <>
            <Navigation/>
            <Container>
                <h1 className="text-center">Home page</h1>
                <Row>
                    {
                        videos.length ? (
                            videos.map(video => (<VideoCard key={video.id} video={video}/>))
                        ) : null
                    }
                </Row>
            </Container>
        </>
    );

};

export default WithServices()(Home);
