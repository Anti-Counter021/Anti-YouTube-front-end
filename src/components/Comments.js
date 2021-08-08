import React, {useEffect, useState} from "react";

import Moment from "react-moment";
import {Link} from "react-router-dom";
import {Image} from "react-bootstrap";

import {SITE} from "../Services";
import WithServices from "./WithService";
import {GetAccessToken} from "../Tokens";

const Comments = ({Service}) => {

    const url = window.location.href.split('/');
    const video_id = url[url.length - 1];

    const [comments, setComments] = useState([]);

    const getComments = async () => {
        await Service.comments(video_id)
            .then(res => setComments(res))
            .catch(error => console.log(error));
    };

    useEffect(async () => {
        await getComments();
    }, [video_id]);

    const addForm = (event) => {
        const parent = event.target.getAttribute('data-id')
        const form = document.querySelector(`#form-${parent}`);

        form.classList.toggle('hide');
    };

    const submitReply = async (event) => {
        event.preventDefault();

        const id = event.target.getAttribute('data-id');
        const text = document.querySelector(`#form-${id}`).querySelector('textarea[name="comment-text"]').value;

        const data = {
            text,
            video_id: video_id,
            parent: id,
        };

        await Service.createComment(data, GetAccessToken())
            .then(async res => {
                const form = document.querySelector(`#form-${id}`);
                form.querySelector('textarea[name="comment-text"]').value = '';
                form.classList.toggle('hide');
                await getComments();
            })
            .catch(error => console.log(error));

    };

    const commentsTree = (commentsList) => {
        const res = (
            <ul style={{listStyleType: 'none'}}>
                <div className="col-md-12 mt-2">
                    {
                        commentsList.map(
                            comment => (
                                <>
                                    <li key={comment.id}>
                                        <hr/>
                                        <div className="col-md-12 mb-2 mt-2 p-0">
                                            <Link to={`/channel/${comment.user.id}`}>
                                                <Image rounded className="avatar" src={`${SITE}${comment.user.avatar}`}/>
                                                &nbsp;{comment.user.username}
                                            </Link> | Published: <Moment date={comment.created_at} format="DD.MM.YYYY"/>
                                            <hr/>
                                            <p>{comment.text}</p>
                                            <Link
                                                className="reply"
                                                data-id={comment.id}
                                                data-parent={comment.parent}
                                                onClick={addForm}
                                            >
                                                Reply
                                            </Link>
                                            <form
                                                className="comment-form form-group hide"
                                                id={`form-${comment.id}`}
                                            >
                                                <textarea maxLength="200" className="form-control" name="comment-text"/>
                                                <br/>
                                                <input
                                                    type="submit"
                                                    onClick={submitReply}
                                                    className="btn btn-primary submit-reply"
                                                    data-id={comment.id}
                                                    data-submit-reply={comment.parent}
                                                    value="Submit"
                                                />
                                            </form>
                                        </div>
                                    </li>
                                    {
                                        comment.children ? (
                                            commentsTree(comment.children)
                                        ) : null
                                    }
                                </>
                            )
                        )
                    }
                </div>
            </ul>
        )
        return res;
    }

    return (
        <>
            {
                comments.length ? (
                    commentsTree(comments)
                ) : (
                    <h1 className="text-center">Comments not exists</h1>
                )
            }
        </>
    );

}

export default WithServices()(Comments);
