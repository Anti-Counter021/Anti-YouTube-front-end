import React, {useState, useEffect} from "react";

import Moment from "react-moment";
import {Link} from "react-router-dom";
import {Badge, Card, CardImg, Container, Image, ListGroup, ListGroupItem, Row} from "react-bootstrap";

import {SITE} from "../Services";
import Navigation from "./Navigation";
import WithServices from "./WithService";


const Category = ({Service}) => {

    const [category, setCategory] = useState({});

    const url = window.location.href.split('/');
    const category_id = url[url.length - 1];

    useEffect(() => {
        Service.category(category_id)
            .then(res => {
                setCategory(res);
            })
            .catch(error => console.log(error));
    }, [category_id]);

    return (
        <>
            <Navigation/>
            {
                category_id && category.id ? (
                    <Container>
                        <Row className="text-center">
                            <h1>{category.name}</h1>
                        </Row>
                        <Row>
                            {
                                category.videos.map(
                                    (
                                        {
                                            id,
                                            title,
                                            preview_file,
                                            views,
                                            created_at,
                                            user: {username, avatar},
                                            votes: {likes, dislikes},
                                        }
                                    ) => (
                                        <div className="col-md-3 mb-2" key={id}>

                                            <Card>
                                                <Link to={`/videos/${id}`}>
                                                    <CardImg
                                                        className="thumbnail"
                                                        variant="top"
                                                        src={`${SITE}${preview_file}`}
                                                    />
                                                </Link>
                                                <Card.Body>
                                                    <Card.Title className="text-center">{title}</Card.Title>
                                                </Card.Body>

                                                <ListGroup>

                                                    <ListGroupItem>
                                                        Views: <Badge pill bg="success">{views}</Badge>
                                                    </ListGroupItem>

                                                    <ListGroupItem>
                                                        Created at: <Moment date={created_at} format="DD.MM.YYYY"/>
                                                    </ListGroupItem>

                                                    <ListGroupItem>
                                                        Author: <span className="author">{username}</span>
                                                        <Image
                                                            className="avatar"
                                                            rounded
                                                            src={`${SITE}${avatar}`}
                                                        />
                                                    </ListGroupItem>

                                                    <ListGroupItem>
                                                        Votes:
                                                        👍 <Badge pill bg="success">{likes}</Badge>
                                                        👎 <Badge pill bg="danger">{dislikes}</Badge>
                                                    </ListGroupItem>

                                                </ListGroup>
                                            </Card>
                                        </div>
                                    )
                                )
                            }
                        </Row>
                    </Container>
                ) : null
            }
        </>
    );

};

export default WithServices()(Category);
