import React, {useState, useEffect} from "react";

import {Container, Row} from "react-bootstrap";

import Error from "./Error";
import Loading from "./Loading";
import VideoCard from "./VideoCard";
import Navigation from "./Navigation";
import WithServices from "./WithService";
import {VideoAuthor} from "./VideoCardComponents";


const Category = ({Service}) => {

    const [category, setCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const url = window.location.href.split('/');
    const category_id = url[url.length - 1];

    useEffect(async () => {
        setLoading(true);
        await Service.category(category_id)
            .then(res => {
                if (res.detail && res.detail.indexOf('not found') + 1) {
                    window.location.href = '/404';
                } else {
                    setCategory(res);
                    setLoading(false);
                }
            })
            .catch(error => setError(true));
    }, [category_id]);

    if (loading) {
        return (<Loading/>);
    }

    if (error) {
        return (<Error/>);
    }

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
                                    video => (
                                        <VideoCard
                                            key={video.id}
                                            components={[<VideoAuthor key={`${video.id}-user`} user={video.user}/>]}
                                            video={video}
                                        />
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
