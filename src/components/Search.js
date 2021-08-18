import React, {useEffect, useState} from "react";

import {Container, Row, FormControl} from "react-bootstrap";

import Error from "./Error";
import Loading from "./Loading";
import VideoCard from "./VideoCard";
import Navigation from "./Navigation";
import WithServices from "./WithService";
import {VideoAuthor, VideoCategory} from "./VideoCardComponents";


const Search = ({Service}) => {

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [error, setError] = useState(false);

    const getVideos = async (query) => {
        await Service.search(query)
            .then(res => {
                setVideos(res);
            })
            .catch(error => setError(true));
    }

    useEffect(async () => {
        setLoading(true);
        await getVideos('');
        setLoading(false);
    }, []);

    const search = async (event) => {
        event.preventDefault();
        setLoadingSearch(true);
        await getVideos(event.target.value);
        setLoadingSearch(false);
    }

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
                <Row className="text-center">
                    <h1>Search</h1>
                    <FormControl onChange={search} name="search" type="text" placeholder="Enter search"/>
                </Row>
                {
                    loadingSearch ? (
                        <Loading/>
                    ) : (
                        <Row className="mt-4">
                            {
                                videos.length ? (
                                    videos.map(video => (
                                        <VideoCard
                                            key={video.id}
                                            video={video}
                                            components={
                                                [
                                                    <VideoAuthor key={`${video.id}-user`} user={video.user}/>,
                                                    <VideoCategory
                                                        key={`${video.id}-category`}
                                                        category={video.category}
                                                    />,
                                                ]
                                            }
                                        />
                                    ))
                                ) : (
                                    <h3 className="text-center">No video yet</h3>
                                )
                            }
                        </Row>
                    )
                }
            </Container>
        </>
    )

}

export default WithServices()(Search);
