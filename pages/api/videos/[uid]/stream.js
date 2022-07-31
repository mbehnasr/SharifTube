import nc from "next-connect";
import fs from "fs";
import Video from "../../../../models/video";
import {connectDBMiddleware} from "../../../../lib/db";
import {BadRequestError, NotFoundError, onError} from "../../../../lib/error";
import {getVideoPath} from "../../../../utils/path";

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
    });

export default handler;