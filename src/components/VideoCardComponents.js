import React from "react";

import {Link} from "react-router-dom";
import {Image, ListGroupItem} from "react-bootstrap";

import {SITE} from "../Services";

const VideoAuthor = ({user: {username, avatar, id}}) => {

    return (
        <ListGroupItem>
            <Link className="user-popup" to={`/channel/${id}`}>
                Author: <span className="author">{username}</span>
                <Image
                    className="avatar"
                    rounded
                    src={`${SITE}${avatar}`}
                />
            </Link>
        </ListGroupItem>
    );

};

const VideoCategory = ({category: {name, id}}) => {

    return (
        <ListGroupItem>
            Category: <Link to={`/categories/${id}`} className="fw-bold">{name}</Link>
        </ListGroupItem>
    );

};

export {VideoAuthor, VideoCategory};
