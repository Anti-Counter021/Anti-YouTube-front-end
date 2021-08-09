import React, {useEffect, useState} from "react";

import {Button, Container, Row} from "react-bootstrap";

import Error from "./Error";
import Loading from "./Loading";
import VideoCard from "./VideoCard";
import Navigation from "./Navigation";
import WithServices from "./WithService";
import {VideoAuthor, VideoCategory} from "./VideoCardComponents";


const Home = ({Service}) => {

    const [videos, setVideos] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [loadingNext, setLoadingNext] = useState(false);

    useEffect(async () => {
        setLoading(true);
        await Service.videos()
            .then(res => {
                setVideos(res);
                setLoading(false);
            })
            .catch(error => setError(true));
    }, []);

    const nextPage = async (page) => {
        setLoadingNext(true);
        await Service.videos(page)
            .then(res => {
                setVideos({...res, results: [...videos.results, ...res.results]});
                setLoadingNext(false);
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
                <h1 className="text-center">Home page</h1>
                <Row>
                    {
                        videos.results && videos.results.length ? (
                            videos.results.map(
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
                {
                    loadingNext ? (
                        <Loading/>
                    ) : null
                }
                {
                    videos.next ? (
                        <Row>
                            <div className="col-md-2"/>
                            <div className="col-md-8 text-center">
                                <Button variant="success" onClick={() => nextPage(videos.next.split('=').pop())}>
                                    More
                                </Button>
                            </div>
                        </Row>
                    ) : null
                }
            </Container>
        </>
    );

};

export default WithServices()(Home);
