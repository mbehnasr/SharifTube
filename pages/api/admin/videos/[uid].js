import nc from "next-connect";
import {authMiddleware} from "../../../../lib/auth";
import {Video} from "video-react";
import {NotFoundError, onError} from "../../../../lib/error";
import {connectDBMiddleware} from "../../../../lib/db";
import {videoFullDto} from "../../../../models/dtos/video";

const handler = nc({onError})
    .use(connectDBMiddleware)
    .use(authMiddleware('admin'))
    .delete(async (req, res) => {
        const video = await Video.findById(req.query.uid);
        if (!video) throw new NotFoundError("video not found");
        video.visible = false;
        await video.save();
        res.status(200).json(videoFullDto(video, req.user));
    });

export default handler;