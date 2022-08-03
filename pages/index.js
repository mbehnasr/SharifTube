import Head from 'next/head'
import Layout from "../components/layout/user";
import {useContext, useEffect, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import SearchContext from "../context/search";
import {VideoCard} from "../components/video";

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
                className="videos-container"
                dataLength={videos.length}
                next={getMoreVideos}
                hasMore={hasMoreVideos}
                loader={<h6>Loading ...</h6>}
            >
                    {videos.map(video => <VideoCard key={video.uid} video={video}/>)}
            </InfiniteScroll>
        </Layout>
    )
}
