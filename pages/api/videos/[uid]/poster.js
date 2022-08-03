import nc from "next-connect";
import {getPosterPath} from "../../../../utils/path";
import fs from "fs";
import Video from "../../../../models/video";
import {connectDBMiddleware} from "../../../../lib/db";
import {NotFoundError, onError} from "../../../../lib/error";

const handler = nc({onError})
    .use(connectDBMiddleware)
    .get(async (req, res) => {
        const video = await Video.findById(req.query.uid);
        if (!video || !video.posterFile) throw new NotFoundError("no poster found for video");
        const path = getPosterPath(video);
        const stream = fs.createReadStream(path);
        const size = fs.statSync(path).size;
        res.writeHead(200, {
            "Content-Type": `image/${video.posterExtension}`,
            "Content-Length": size,
        });
        stream.pipe(res);
    });

export default handler;