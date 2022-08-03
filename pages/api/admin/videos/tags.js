import nc from "next-connect";
import {authMiddleware} from "../../../../lib/auth";
import {connectDBMiddleware} from "../../../../lib/db";
import {Video} from "video-react";
import {NotFoundError} from "../../../../lib/error";
import {videoFullDto} from "../../../../models/dtos/video";

const handler = nc()
    .use(connectDBMiddleware)
    .use(authMiddleware('admin'))
    .post(async (req, res) => {
        const {uid} = req.params;
        const video = await Video.findById(uid);
        if (!video) throw new NotFoundError("video not found");
        video.extraTags.push(req.body.tag);
        await video.save();
        res.status(200).json(videoFullDto(video, req.user));
    });

export default handler;