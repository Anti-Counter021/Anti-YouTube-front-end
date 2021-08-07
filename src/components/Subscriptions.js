import React, {useEffect, useState} from "react";

import {Container, Row} from "react-bootstrap";

import Error from "./Error";
import Loading from "./Loading";
import VideoCard from "./VideoCard";
import Navigation from "./Navigation";
import {GetAccessToken} from "../Tokens";
import WithServices from "./WithService";
import {VideoCategory, VideoAuthor} from "./VideoCardComponents";


const Subscriptions = ({Service}) => {

    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(async () => {
        setLoading(true);
        await Service.subscriptions(GetAccessToken())
            .then(res => {
                setSubscriptions(res);
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
                <h1 className="text-center">Subscriptions</h1>
                <Row>
                    {
                        subscriptions.length ? (
                            subscriptions.map(
                                subscription => (
                                    subscription.videos.map(
                                        video => (
                                            <VideoCard
                                                video={video}
                                                components={
                                                    [
                                                        <VideoCategory category={video.category}/>,
                                                        <VideoAuthor user={subscription.user}/>,
                                                    ]
                                                }
                                            />
                                        )
                                    )
                                )
                            )
                        ) : (<h1 className="text-center">You haven't subscribed to anyone yet</h1>)
                    }
                </Row>
            </Container>
        </>
    );

};

export default WithServices()(Subscriptions);
