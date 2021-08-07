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
            user: {username, avatar},
            votes: {likes, dislikes},
        }
    }
) => {

    return (
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
    );

};

export default VideoCard;
