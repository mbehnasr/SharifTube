import nc from "next-connect";
import {getPosterPath} from "../../../../utils/path";
import fs from "fs";
import Video from "../../../../models/video";
import {connectDBMiddleware} from "../../../../lib/db";

const handler = nc()
    .use(connectDBMiddleware)
    .get(async (req, res) => {
        const video = await Video.findById(req.query.uid);
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