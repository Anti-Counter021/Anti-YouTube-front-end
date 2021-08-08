import React, {useEffect, useState} from "react";

import Moment from "react-moment";
import {Link} from "react-router-dom";
import {Badge, Form, FormControl, Image} from "react-bootstrap";

import Error from "./Error";
import Loading from "./Loading";
import {SITE} from "../Services";
import WithServices from "./WithService";
import {GetAccessToken, GetRefreshToken} from "../Tokens";

const Comments = ({Service}) => {

    const url = window.location.href.split('/');
    const video_id = url[url.length - 1];

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const getComments = async () => {
        setLoading(true);
        await Service.comments(video_id)
            .then(res => {
                setComments(res);
                setLoading(false);
            })
            .catch(error => setError(true));
    };

    useEffect(async () => {
        await getComments();
    }, [video_id]);

    if (loading) {
       return (<Loading/>);
    }

    if (error) {
        return (<Error/>);
    }

    const addForm = (event) => {
        const parent = event.target.getAttribute('data-id')
        const form = document.querySelector(`#form-${parent}`);

        form.classList.toggle('hide');
    };

    const submitReply = async (event) => {
        event.preventDefault();

        if (!GetRefreshToken()) {
            alert("You don't authorized");
            window.location.href = '/login';
            return
        }

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
                form.querySelector('.left-chars').textContent = '200';
                await getComments();
            })
            .catch(error => console.log(error));

    };

    const leftChars = (event) => {
        const value = event.target.value;
        const counterLeft = event.target.parentElement.querySelector('.left-chars');
        counterLeft.textContent = event.target.maxLength - value.length;
    }

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
                                                {
                                                    comment.user.avatar ? (
                                                        <Image
                                                            rounded
                                                            className="avatar"
                                                            src={`${SITE}${comment.user.avatar}`}
                                                        />
                                                    ) : (
                                                        <Image
                                                            className="avatar"
                                                            rounded
                                                            src="https://via.placeholder.com/80x80"
                                                        />
                                                    )
                                                }
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
                                                <textarea
                                                    maxLength="200"
                                                    className="form-control"
                                                    name="comment-text"
                                                    onChange={leftChars}
                                                />
                                                <Badge className="mt-1 mb-1 left-chars" pill bg="success">200</Badge>
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
            <Link
                className="reply"
                data-id="0"
                data-parent="0"
                onClick={addForm}
            >
                Add comment
            </Link>
            <Form className="comment-form form-group hide" id="form-0">
                <FormControl as="textarea" maxLength="200" name="comment-text" onChange={leftChars}/>
                <Badge className="mt-1 mb-1 left-chars" pill bg="success">200</Badge>
                <br/>
                <input type="submit" className="btn btn-primary" value="Submit" onClick={submitReply} data-id="0"/>
            </Form>
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
