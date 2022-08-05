import nc from "next-connect";
import {NotFoundError, onError} from "../../../../lib/error";
import {connectDBMiddleware} from "../../../../lib/db";
import {authMiddleware} from "../../../../lib/auth";
import {videoAdminDto} from "../../../../models/dtos/video";
import Video from "../../../../models/video";

const handler = nc({onError})
    .use(connectDBMiddleware)
    .use(authMiddleware('admin'))
    .get(async (req, res) => {
        const {uid} = req.query;
        const video = await Video.findById(uid);
        if (!video) throw new NotFoundError("video not found");
        res.status(200).json(videoAdminDto(video));
    });

export default handler;