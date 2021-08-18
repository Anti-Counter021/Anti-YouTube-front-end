import React, {useState, useEffect} from "react";

import {Container, Image, ListGroup, ListGroupItem, Row, Badge, Button, Alert} from "react-bootstrap";

import Error from "./Error";
import Loading from "./Loading";
import {SITE} from "../Services";
import VideoCard from "./VideoCard";
import Navigation from "./Navigation";
import {GetAccessToken} from "../Tokens";
import WithServices from "./WithService";
import {VideoCategory} from "./VideoCardComponents";

const Channel = ({Service}) => {

    const [channel, setChannel] = useState({});
    const [videos, setVideos] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const url = window.location.href.split('/');
    const channel_id = url[url.length - 1];

    const getChannel = async () => {
        setLoading(true)
        await Service.channel(channel_id, GetAccessToken())
            .then(res => {
                if (res.detail && res.detail.indexOf('not found') + 1) {
                    window.location.href = '/404';
                } else {
                    setChannel(res);
                    setLoading(false);
                }
            })
            .catch(error => setError(true));

        await Service.channelVideos(channel_id)
            .then(res => {
                if (res.detail && res.detail.indexOf('not found') + 1) {
                    window.location.href = '/404';
                } else {
                    setVideos(res);
                    setLoading(false);
                }
            })
            .catch(error => setError(true));
    }

    useEffect(async () => {
        await getChannel();
    }, [channel_id]);

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

    const follow = async (user_id) => {
        await Service.follow(user_id, GetAccessToken())
            .then(async res => {
                await getChannel();
                setShow(true);
                document.querySelector('#success').textContent = res.msg;
            })
            .catch(error => console.log(error));
    }

    const unfollow = async (user_id) => {
        await Service.unfollow(user_id, GetAccessToken())
            .then(async res => {
                await getChannel();
                setShow(true);
                document.querySelector('#success').textContent = res.msg;
            })
            .catch(error => console.log(error));
    }

    let followBtn;
    switch (channel.is_following) {
        case (null):
            followBtn = (<h3>You not authorized</h3>);
            break;
        case (3):
            followBtn = (<h3>You cannot be subscribed to yourself</h3>);
            break;
        case (0):
            followBtn = (
                <Button variant="success" onClick={() => follow(channel.id)}>
                    Follow
                </Button>
            );
            break;
        case (1):
            followBtn = (
                <Button variant="danger" onClick={() => unfollow(channel.id)}>
                    Unfollow
                </Button>
            );
            break;
    }

    return (
        <>
            <Navigation/>
            {
                channel ? (
                    <Container className="mt-5">
                        <Row>
                            {
                                show ? (
                                    <Alert className="text-center" variant="success" onClose={() => setShow(false)}>
                                        <div className="d-flex justify-content-end">
                                            <Button onClick={() => setShow(false)} variant="success" style={{color: "#000"}}>
                                                X
                                            </Button>
                                        </div>
                                        <p id="success"/>
                                    </Alert>
                                ) : null
                            }
                            <h1 className="mt-3 text-center">{channel.username}</h1>
                        </Row>
                        <Row>
                            <div className="col-md-5 image-block">
                                {
                                    channel.avatar ? (
                                        <Image rounded className="avatar-big" src={`${SITE}${channel.avatar}`}/>
                                    ) : (
                                        <Image className="avatar-big" src="https://via.placeholder.com/400x400" rounded/>
                                    )
                                }
                            </div>
                            <div className="col-md-7">
                                <ListGroup className="text-center">

                                    <ListGroupItem>
                                        <span className="h4">Statistic</span>
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        <span className="fw-bold">Followers</span>&nbsp;
                                        <Badge pill bg="success">{channel.followers_count}</Badge>
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        <span className="fw-bold">Count videos</span>&nbsp;
                                        <Badge pill bg="success">{channel.count_videos}</Badge>
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        <span className="fw-bold">Views</span>&nbsp;
                                        <Badge pill bg="success">{channel.views}</Badge>
                                    </ListGroupItem>

                                </ListGroup>

                                <ListGroup>

                                    <ListGroupItem className="text-center">
                                        <span className="h4">About</span>
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        <span className="text-start">{channel.about}</span>
                                    </ListGroupItem>

                                </ListGroup>

                                <div className="text-center mt-2">
                                    {followBtn}
                                </div>

                            </div>
                        </Row>

                        <Row className="mt-3">
                            <h1 className="text-center">Videos</h1>
                            {
                                videos && videos.length ? (
                                    videos.map(
                                        video => (
                                            <VideoCard
                                                key={video.id}
                                                video={video}
                                                components={
                                                    [
                                                        <VideoCategory
                                                            key={`${video.id}-category`}
                                                            category={video.category}
                                                        />
                                                    ]
                                                }
                                            />
                                        )
                                    )
                                ) : (
                                    <h3 className="text-center">Not yet published</h3>
                                )
                            }
                        </Row>

                    </Container>
                ) : null
            }
        </>
    );

};

export default WithServices()(Channel);
