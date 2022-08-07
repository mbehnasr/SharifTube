import nc from "next-connect";
import {NotFoundError, onError} from "../../../../lib/error";
import {connectDBMiddleware} from "../../../../lib/db";
import {authMiddleware} from "../../../../lib/auth";
import Ticket from "../../../../models/ticket";
import {ticketAdminFullDto} from "../../../../models/dtos/ticket";
import {Role} from "../../../../models/user";
import multer from "multer";
import {getAttachmentPath} from "../../../../utils/path";
import fs from "fs";

const handler = nc({onError})
    .use(connectDBMiddleware)
    .use(authMiddleware(Role.ADMIN))
    .get(async (req, res) => {
        const {uid} = req.query;
        const ticket = await Ticket.findById(uid);
        if (!ticket) throw new NotFoundError("ticket not found");
        res.status(200).json(ticketAdminFullDto(ticket));
    })
    .patch(multer().single("attachment"), async (req, res) => {
        const {uid} = req.query;
        const ticket = await Ticket.findById(uid);
        if (!ticket) throw new NotFoundError("ticket not found");
        const {answer, status} = req.body;
        ticket.answer = answer || ticket.answer;
        ticket.status = status || ticket.status;
        if (req.file) {
            ticket.fileExtension = req.file.originalname.split('.').pop()
            ticket.fileName = req.file.originalname;
            const filePath = getAttachmentPath(ticket);
            const stream = fs.createWriteStream(filePath);
            stream.write(req.file.buffer);
        }
        await ticket.save();
        res.status(200).json(ticketAdminFullDto(ticket));
    });

export const config = {
    api: {
        bodyParser: false,
    }
}

export default handler;