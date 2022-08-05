import nc from "next-connect";
import busboy from "busboy";
import fs from "fs";
import Video from "../../../models/video";
import {authMiddleware, strikeAuthMiddleware, withUser} from "../../../lib/auth";
import {connectDBMiddleware} from "../../../lib/db";
import {getVideoPath} from "../../../utils/path";
import {videoFullDto} from "../../../models/dtos/video";

const handler = nc()
    .use(connectDBMiddleware)
    .get(withUser, async (req, res) => {
        const q = req.query.q;
        const start = parseInt(req.query.start || 0);
        const limit = parseInt(req.query.limit || 10);
        const search = {$or: [{visible: {$eq: null}}, {visible: true}]};
        if (q) search.$text = {$search: q};
        const videos = await Video.find(search).skip(start).limit(limit);
        res.status(200).json(videos.map(v => videoFullDto(v, req.user)));
    })
    .post(strikeAuthMiddleware('user'), async (req, res) => {
        const bb = busboy({headers: req.headers});
        let newVideo;
        bb.on("file", async (_, file, info) => {
            const fileExt = info.filename.split('.').pop()
            newVideo = await Video.create({
                file: info.filename,
                user: {
                    _id: req.user._id,
                    username: req.user.username,
                },
                extension: fileExt,
            })
            const filePath = getVideoPath(newVideo);
            const stream = fs.createWriteStream(filePath);
            file.pipe(stream);
        });
        bb.on("close", () => {
            res.writeHead(200, { Connection: "close", "Content-Type": "application/json" });
            res.end(JSON.stringify({
                uid: newVideo._id,
            }));
        });
        return req.pipe(bb);
    });

export default handler;

export const config = {
    api: {
        bodyParser: false,
    }
}