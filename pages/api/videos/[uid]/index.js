import nc from "next-connect";
import {authMiddleware, withUser} from "../../../../lib/auth";
import multer from "multer";
import Video from "../../../../models/video";
import {ForbiddenError, NotFoundError, onError} from "../../../../lib/error";
import {getPosterPath, getVideoPath} from "../../../../utils/path";
import fs from "fs";
import getVideoDurationInSeconds from "get-video-duration";
import {connectDBMiddleware} from "../../../../lib/db";
import {videoFullDto} from "../../../../models/dtos/video";

const handler = nc({onError})
    .use(connectDBMiddleware)
    .get(withUser, async (req, res) => {
        const video = await Video.findById(req.query.uid);
        if (!video) throw new NotFoundError("video not found");
        res.status(200).json(videoFullDto(video, req.user));
    })
    .put(authMiddleware('user'), multer().single("poster"), async (req, res) => {
        const video = await Video.findById(req.query.uid);

        if (!video) throw new NotFoundError("no video found")
        if (!video.user._id.equals(req.user._id)) throw new ForbiddenError("you are not permitted to edit this video")

        const fileExt = req.file.originalname.split('.').pop()

        video.title = req.body.title;
        video.description = req.body.description;
        video.posterFile = req.file.originalname;
        video.posterExtension = fileExt;

        const filePath = getPosterPath(video);
        const stream = fs.createWriteStream(filePath);

        stream.write(req.file.buffer);

        await video.save();

        getVideoDurationInSeconds(getVideoPath(video))
            .then(duration => {
                video.duration = Math.round(duration);
                video.save();
            });

        res.status(200).json({
            uid: req.query.uid,
        });
    });

export const config = {
    api: {
        bodyParser: false,
    }
}

export default handler;