import React, {useEffect, useState} from "react";

import {Link} from "react-router-dom";
import {Card, CardImg, Container, Row} from "react-bootstrap";

import Error from "./Error";
import Loading from "./Loading";
import {SITE} from "../Services";
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
                <h1 className="text-center">Subscriptions</h1>
                <Row>
                    {
                        subscriptions.length ? (
                            subscriptions.map(
                                subscription => (
                                    <div className="col-md-2 mb-2" key={subscription.user.id}>
                                        <Link to={`/channel/${subscription.user.id}`}>
                                            <Card>
                                                {
                                                    subscription.user.avatar ? (
                                                        <CardImg
                                                            className="avatar"
                                                            variant="top"
                                                            src={`${SITE}${subscription.user.avatar}`}
                                                        />
                                                    ) : (
                                                        <CardImg
                                                            className="avatar"
                                                            variant="top"
                                                            src="https://via.placeholder.com/80x80"
                                                        />
                                                    )
                                                }
                                                <Card.Body>
                                                    <Card.Title className="text-center">
                                                        {subscription.user.username}
                                                    </Card.Title>
                                                </Card.Body>
                                            </Card>
                                        </Link>
                                    </div>
                                )
                            )
                        ) : null
                    }
                </Row>
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
