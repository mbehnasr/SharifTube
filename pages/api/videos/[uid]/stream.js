import nc from "next-connect";
import multer from "multer";
import fs from "fs";
import Video from "../../../../models/video";
import getVideoDurationInSeconds from "get-video-duration";
import {connectDBMiddleware} from "../../../../lib/db";
import {BadRequestError, NotFoundError, onError, ForbiddenError} from "../../../../lib/error";
import {getPosterPath, getVideoPath} from "../../../../utils/path";
import {authMiddleware} from "../../../../lib/auth";

const CHUNK_SIZE = 2 ** 20 - 1;

const handler = nc({onError})
    .use(connectDBMiddleware)
    .get(async (req, res) => {
        const range = req.headers.range;
        if (!range) throw new BadRequestError("no range specified")

        const video = await Video.findById(req.query.uid)
        if (!video) throw new NotFoundError("no video found")

        const videoPath = getVideoPath(video)
        const fileSize = fs.statSync(videoPath).size;
        const start = parseInt(range.replace(/bytes=/, "").split('-')[0], 10);
        const end = Math.min(start + CHUNK_SIZE, fileSize - 1);
        const stream = fs.createReadStream(videoPath, {start, end});
        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': end-start+1,
            'Content-Type': `video/${video.extension}`,
        });
        stream.pipe(res);
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