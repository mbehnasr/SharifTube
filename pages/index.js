import Head from 'next/head'
import Layout from "../components/layout/user";
import {useContext, useEffect, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {Badge, Card, Row} from "react-bootstrap";
import axios from "axios";
import SearchContext from "../context/search";
import Link from "next/link";
import {css} from "@emotion/react";

const VIDEOS_PAGE_SIZE = 20;

export default function Home() {
    const [videos, setVideos] = useState([]);
    const [hasMoreVideos, setHasMoreVideos] = useState(true);
    const [videosPage, setVideosPage] = useState(0);
    const {q} = useContext(SearchContext);

    const getMoreVideos = () => {
        axios.get(`/api/videos`, {
            params: {
                start: videosPage * VIDEOS_PAGE_SIZE,
                limit: VIDEOS_PAGE_SIZE,
                q,
            }
        }).then(data => {
            setVideos(videos.concat(data.data));
            setVideosPage(videosPage + 1);
            if (data.data.length < VIDEOS_PAGE_SIZE)
                setHasMoreVideos(false);
        })
    }

    useEffect(() => {
        getMoreVideos();
    }, [])

    return (
        <Layout>
            <Head>
                <title>SharifTube</title>
                <meta name="description" content="Sharif University Video Sharing System"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <InfiniteScroll
                className="overflow-hidden"
                dataLength={videos.length}
                next={getMoreVideos}
                hasMore={hasMoreVideos}
                loader={<h6>Loading comments ...</h6>}
            >
                <Row>
                    {videos.map(video => (
                        <Link key={video.uid} href={`/${video.uid}`}>
                            <Card className="col-4 p-2 border-0 cursor-pointer">
                                <Card.Img variant="top" src={`/api/videos/${video.uid}/poster`}/>
                                <Badge css={css`width: 45px; margin-top: -25px; margin-left: 5px`} bg="light" text="dark">
                                    {Math.floor(video.duration / 60)}:{video.duration % 60}
                                </Badge>
                                <Card.Body>
                                    <Card.Title>{video.title}</Card.Title>
                                    <Card.Text>
                                        {video.description}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    ))}
                </Row>
            </InfiniteScroll>
        </Layout>
    )
}
