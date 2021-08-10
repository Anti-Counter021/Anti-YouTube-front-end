import React from "react";

import Moment from "react-moment";
import {Link} from "react-router-dom";
import {Badge, Card, CardImg, Image, ListGroup, ListGroupItem} from "react-bootstrap";

import {SITE} from "../Services";

const VideoCard = (
    {
        video: {
            id,
            title,
            preview_file,
            views,
            created_at,
            votes: {likes, dislikes},
        },
        components,
    },
) => {

    return (
        <div className="col-md-3 mb-2" key={id}>

            <Card>
                <Link to={`/videos/${id}`} className="thumbnail-block">
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

                    {
                        components ? (
                            components.map(component => (component))
                        ) : null
                    }

                    <ListGroupItem>
                        Votes:
                        <i className="fas fa-thumbs-up"/> <Badge pill bg="success">{likes}</Badge>
                        <i className="fas fa-thumbs-down"/> <Badge pill bg="danger">{dislikes}</Badge>
                    </ListGroupItem>

                </ListGroup>
            </Card>
        </div>
    );

};

export default VideoCard;
