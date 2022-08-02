import Layout from "../components/layout/user";
import {VideoPlayer} from "../components/video";
import Video from "../models/video";
import {videoFullDto} from "../models/dtos/video";
import {getUser} from "../lib/auth";
import {db} from "../lib/db";
import {Button, Card} from "react-bootstrap";
import Head from "next/head";
import InfiniteScroll from "react-infinite-scroll-component";
import {useEffect, useState} from "react";
import axios from "axios";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {css} from "@emotion/react";
import {userLightDto} from "../models/dtos/user";
import {useForm} from "react-hook-form";

const COMMENTS_PAGE_SIZE = 10;

const likeButtonTemplate = css`
  background-color: transparent;
  border: none;
`

export default function VideoPage({uid, src, poster, videoInfo, user}) {
    const [comments, setComments] = useState([]);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [commentsPage, setCommentsPage] = useState(0);
    const [theVideoInfo, setTheVideoInfo] = useState(videoInfo);
    const {register, handleSubmit} = useForm();

    const getMoreComments = () => {
        axios.get(`/api/videos/${uid}/comments`, {
            params: {
                start: commentsPage * COMMENTS_PAGE_SIZE,
                limit: COMMENTS_PAGE_SIZE
            }
        }).then(data => {
            setComments(comments.concat(data.data));
            setCommentsPage(commentsPage + 1);
            if (data.data.length < COMMENTS_PAGE_SIZE)
                setHasMoreComments(false);
        })
    }

    const onAddComment = data => {
        axios.post(`/api/videos/${uid}/comments`, data)
            .then(res => setComments([res.data].concat(comments)))
    }

    const getLikeButton = () => {
        return <button css={likeButtonTemplate} disabled={!user} onClick={() => axios.post(`/api/videos/${uid}/likes`).then(res => setTheVideoInfo(res.data))}>
            <FavoriteBorderIcon />
        </button>
    }

    const getDislikeButton = () => {
        return <button css={likeButtonTemplate} disabled={!user} onClick={() => axios.delete(`/api/videos/${uid}/likes`).then(res => setTheVideoInfo(res.data))}>
            <FavoriteIcon />
        </button>
    }

    useEffect(() => {
        getMoreComments();
    }, []);

    return (
        <Layout>
            <Head>
                <title>{theVideoInfo.title}</title>
            </Head>
            <VideoPlayer src={src} poster={poster}/>
            <div className="m-2">
                {theVideoInfo.liked ? getDislikeButton() : getLikeButton()}
                {theVideoInfo.likes}
            </div>
            <h1>{theVideoInfo.title}</h1>
            <p>{theVideoInfo.description}</p>
            <Card className="d-flex flex-row justify-content-between p-2 align-items-center">
                <h4 className="m-0">{theVideoInfo.user.username}</h4>
                <Button variant="danger">subscribe</Button>
            </Card>
            <h4 className="mt-4">comments</h4>
            {user && <form onSubmit={handleSubmit(onAddComment)}>
                <textarea className="form-control" {...register('text')} />
                <button className="btn" type="submit">add comment</button>
            </form>}
            <InfiniteScroll
                dataLength={comments.length}
                next={getMoreComments}
                hasMore={hasMoreComments}
                loader={<h6>Loading comments ...</h6>}
            >
                {comments.map(comment => (
                    <Card key={comment.uid} className="my-3">
                        <Card.Header className="p-2 d-flex justify-content-between">
                            <span>{comment.user.username}</span>
                            <span>{comment.createdAt}</span>
                        </Card.Header>
                        <Card.Body className="p-2">
                            {comment.text}
                        </Card.Body>
                    </Card>
                ))}
            </InfiniteScroll>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const {videoUid} = context.params;
    await db();
    const video = await Video.findById(videoUid);
    if (!video) return {notFound: true};
    const user = await getUser(context);
    return {
        props: {
            uid: videoUid,
            user: user && userLightDto(user),
            src: `/api/videos/${videoUid}/stream`,
            poster: `/api/videos/${videoUid}/poster`,
            videoInfo: videoFullDto(video, user),
        }
    }
}