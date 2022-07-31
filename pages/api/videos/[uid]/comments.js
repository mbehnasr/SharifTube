import nc from "next-connect";
import {connectDBMiddleware} from "../../../../lib/db";
import {NotFoundError, onError} from "../../../../lib/error";
import {authMiddleware} from "../../../../lib/auth";
import Video from "../../../../models/video";
import {commentLightDto} from "../../../../models/dtos/comment";

const handler = nc({onError})
    .use(connectDBMiddleware)
    .get(async (req, res) => {
        const video = await Video.findById(req.query.uid);
        if (!video) throw new NotFoundError("video not found");
        const start = parseInt(req.query.start || 0);
        const limit = parseInt(req.query.limit || 10);
        const comments = video.comments.slice(start, start + limit);
        res.status(200).json(comments.map(commentLightDto));
    })
    .post(authMiddleware('user'), async (req, res) => {
        const video = await Video.findById(req.query.uid);
        if (!video) throw new NotFoundError("video not found");
        const comment = {
            author: {
                _id: req.user._id,
                username: req.user.username,
            },
            content: req.body.text,
        }
        video.comments.push(comment);
        await video.save();
        res.status(201).json(comment);
    });

export default handler;