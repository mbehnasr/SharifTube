import nc from "next-connect";
import {authMiddleware} from "../../../../../lib/auth";
import {connectDBMiddleware} from "../../../../../lib/db";
import {NotFoundError} from "../../../../../lib/error";
import {videoAdminDto} from "../../../../../models/dtos/video";
import Video from "../../../../../models/video";

const handler = nc()
    .use(connectDBMiddleware)
    .use(authMiddleware('admin'))
    .post(async (req, res) => {
        const {uid} = req.query;
        const video = await Video.findById(uid);
        if (!video) throw new NotFoundError("video not found");
        video.extraTags.push(req.body.tag);
        await video.save();
        res.status(200).json(videoAdminDto(video));
    })
    .delete(async (req, res) => {
        const {uid, tag} = req.query;
        const video = await Video.findById(uid);
        if (!video) throw new NotFoundError("video not found");
        video.extraTags = video.extraTags.filter(t => t !== tag);
        await video.save();
        res.status(200).json(videoAdminDto(video));
    });

export default handler;