import nc from "next-connect";
import multer from "multer";
import fs from "fs";
import Video from "../../../../models/video";
import getVideoDurationInSeconds from "get-video-duration";
import {connectDBMiddleware} from "../../../../lib/db";

const handler = nc()
    .use(connectDBMiddleware)
    .use(multer().single("poster"))
    .put(async (req, res) => {
        const video = await Video.findById(req.query.uid);
        const fileExt = req.file.originalname.split('.').pop()
        const filePath = `${process.cwd()}/public/posters/${req.query.uid}.${fileExt}`;
        const stream = fs.createWriteStream(filePath);
        stream.write(req.file.buffer);
        video.title = req.body.title;
        video.description = req.body.description;
        video.save()
        getVideoDurationInSeconds(`${process.cwd()}/public/uploads/${video._id.toString()}.${video.extension}`)
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