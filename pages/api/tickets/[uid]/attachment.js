import nc from "next-connect";
import {NotFoundError, onError} from "../../../../lib/error";
import {connectDBMiddleware} from "../../../../lib/db";
import Video from "../../../../models/video";
import {getAttachmentPath, getPosterPath} from "../../../../utils/path";
import fs from "fs";
import Ticket from "../../../../models/ticket";

const handler = nc({onError})
    .use(connectDBMiddleware)
    .get(async (req, res) => {
        const ticket = await Ticket.findById(req.query.uid);
        if (!ticket || !ticket.hasAttachment()) throw new NotFoundError("no poster found for video");
        const path = getAttachmentPath(ticket);
        const stream = fs.createReadStream(path);
        const size = fs.statSync(path).size;
        res.writeHead(200, {
            "Content-Length": size,
            "Content-Disposition": `attachment; filename="${ticket.fileName}"`,
        });
        stream.pipe(res);
    });

export default handler;