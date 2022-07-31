import nc from "next-connect";
import busboy from "busboy";
import fs from "fs";
import Video from "../../../models/video";
import {Types} from "mongoose";
import {authMiddleware} from "../../../lib/auth";
import {connectDBMiddleware} from "../../../lib/db";

const handler = nc()
    .use(connectDBMiddleware)
    .use(authMiddleware('user'))
    .post(async (req, res) => {
        const bb = busboy({headers: req.headers});
        let newVideo;
        bb.on("file", async (_, file, info) => {
            const fileExt = info.filename.split('.').pop()
            newVideo = await Video.create({
                file: info.filename,
                user: {
                    _id: Types.ObjectId(req.user._id),
                    username: req.user.username,
                },
                extension: fileExt,
            })
            const filePath = `${process.cwd()}/public/uploads/${newVideo._id}.${fileExt}`;
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