import nc from "next-connect";
import {connectDBMiddleware} from "../../../../lib/db";
import {BadRequestError, NotFoundError, onError} from "../../../../lib/error";
import {authMiddleware} from "../../../../lib/auth";
import Video from "../../../../models/video";
import {videoFullDto} from "../../../../models/dtos/video";

const handler = nc({onError})
    .use(connectDBMiddleware)
    .use(authMiddleware('user'))
    .post(async (req, res) => {
        const video = await Video.findById(req.query.uid);
        if (!video) throw new NotFoundError("video not found");
        if (video.likes.includes(req.user._id)) throw new BadRequestError("already liked");
        video.likes.push(req.user._id);
        await video.save();
        res.status(200).json(videoFullDto(video, req.user))
    })
    .delete(async (req, res) => {
        const video = await Video.findById(req.query.uid);
        if (!video) throw new NotFoundError("video not found");
        if (!video.likes.includes(req.user._id)) throw new BadRequestError("not liked");
        video.likes.pull(req.user._id);
        await video.save();
        res.status(200).json(videoFullDto(video, req.user))
    });

export default handler;