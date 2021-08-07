import React, {useEffect, useState} from "react";

import Moment from "react-moment";
import {Link} from "react-router-dom";
import {Alert, Badge, Button, Container, Image, ListGroup, ListGroupItem, Row} from "react-bootstrap";

import Error from "./Error";
import Loading from "./Loading";
import {SITE} from "../Services";
import {GetAccessToken} from "../Tokens";
import Navigation from "./Navigation";
import WithServices from "./WithService";

const Video = ({Service}) => {

    const [video, setVideo] = useState({});
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const url = window.location.href.split('/');
    const video_id = url[url.length - 1];

    useEffect(async () => {
        setLoading(true);
        await Service.video(video_id)
            .then(res => {
                if (res.detail && res.detail.indexOf('not found') + 1) {
                    window.location.href = '/404';
                } else {
                    setVideo(res);
                    setLoading(false);
                }
            })
            .catch(error => setError(true));
    }, [video_id]);

    if (loading) {
        return (<Loading/>);
    }

    if (error) {
        return (<Error/>);
    }

    const to_vote = async (vote) => {
        await Service.vote({vote, video_id}, GetAccessToken())
            .then(res => {
                if (res.detail) {
                    setShow(true);
                    document.querySelector('#error').textContent = res.detail;
                } else {
                    setVideo(res);
                }
            })
            .catch(error => {
                if (error.message.indexOf('401') + 1) {
                    setShow(true);
                    document.querySelector('#error').textContent = 'You not authorized';
                } else if (error.message.indexOf('403') + 1) {
                    setShow(true);
                    document.querySelector('#error').textContent = 'You not activated'
                }
                console.log(error);
            });
    };

    const like = () => {
        to_vote(1);
    };

    const dislike = () => {
        to_vote(0);
    };

    return (
        <>
            <Navigation/>
            <Container>
                {
                    video.id ? (
                        <Row className="text-center video-container">
                            <h1>{video.title}</h1>
                            {
                                show ? (
                                    <Alert variant="warning" onClose={() => setShow(false)}>
                                        <div className="d-flex justify-content-end">
                                            <Button
                                                onClick={() => setShow(false)}
                                                variant="warning"
                                                style={{color: "#000"}}
                                            >
                                                X
                                            </Button>
                                        </div>
                                        <p id="error"/>
                                    </Alert>
                                ) : null
                            }
                            <div className="col-md-8">
                                <div className="video">
                                    <video
                                        controls
                                        poster={`${SITE}${video.preview_file}`}
                                        className="container-fluid"
                                    >
                                        <source
                                            src={`${SITE}videos/video/${video.id}`}
                                            type="video/mp4"
                                        />
                                        <source
                                            src={`${SITE}videos/video/${video.id}`}
                                            type="video/webm"
                                        />
                                    </video>
                                </div>

                                <p className="text-start">{video.description}</p>
                            </div>

                            <div className="col-md-4">
                                <ListGroup>

                                    <ListGroupItem>
                                        <span className="h4 fw-bold">Category</span>
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        <Link to={`/categories/${video.category.id}`}>
                                            {video.category.name}
                                        </Link>
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        <span className="h4 fw-bold">Author</span>
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        <Link to={`/channel/${video.user.id}`}>
                                            {video.user.username}
                                            {
                                                video.user.avatar ? (
                                                    <Image
                                                        src={`${SITE}${video.user.avatar}`}
                                                        rounded
                                                        className="avatar"
                                                    />
                                                ) : (
                                                    <Image
                                                        className="avatar"
                                                        rounded
                                                        src="https://via.placeholder.com/80x80"
                                                    />
                                                )
                                            }
                                        </Link>
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        <span className="h4 fw-bold">Statistic</span>
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        Votes:
                                        <span id="like" onClick={like}>
                                            <i class="fas fa-thumbs-up"/> <Badge pill bg="success">{video.votes.likes}</Badge>
                                        </span>
                                        <span id="dislike" onClick={dislike}>
                                            <i class="fas fa-thumbs-down"/> <Badge pill bg="danger">{video.votes.dislikes}</Badge>
                                        </span>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        Views: <Badge pill bg="success">{video.views}</Badge>
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        <span className="h4 fw-bold">Created at</span>
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        <Moment date={video.created_at} format="DD.MM.YYYY"/>
                                    </ListGroupItem>

                                </ListGroup>
                            </div>

                        </Row>
                    ) : null
                }
            </Container>
        </>
    );

}

export default WithServices()(Video);
