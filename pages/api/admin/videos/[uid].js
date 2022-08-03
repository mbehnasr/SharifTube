import nc from "next-connect";
import {authMiddleware} from "../../../../lib/auth";
import {Video} from "video-react";
import {NotFoundError, onError} from "../../../../lib/error";
import {connectDBMiddleware} from "../../../../lib/db";
import {videoFullDto} from "../../../../models/dtos/video";
import User from "../../../../models/user";

const handler = nc({onError})
    .use(connectDBMiddleware)
    .use(authMiddleware('admin'))
    .delete(async (req, res) => {
        const video = await Video.findById(req.query.uid);
        if (!video) throw new NotFoundError("video not found");
        video.visible = false;
        await video.save();
        const nextVideo = await Video.find({"user._id": video.user._id, _id: {$gt: video._id}}).sort({_id: 1}).limit(1);
        const prevVideo = await Video.find({"user._id": video.user._id, _id: {$lt: video._id}}).sort({_id: 1}).limit(1);
        if ((nextVideo && !nextVideo.visible) || (prevVideo && !prevVideo.visible)) {
            const user = await User.findById(video.user._id);
            user.strike = true;
            await user.save();
        }
        res.status(200).json(videoFullDto(video, req.user));
    });

export default handler;