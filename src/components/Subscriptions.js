import React, {useEffect, useState} from "react";

import {Container, Row} from "react-bootstrap";

import VideoCard from "./VideoCard";
import Navigation from "./Navigation";
import {GetAccessToken} from "../Tokens";
import WithServices from "./WithService";
import {VideoCategory, VideoAuthor} from "./VideoCardComponents";


const Subscriptions = ({Service}) => {

    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(async () => {
        await Service.subscriptions(GetAccessToken())
            .then(res => setSubscriptions(res))
            .catch(error => console.log(error));
    }, []);

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
