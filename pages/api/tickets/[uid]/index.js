import nc from "next-connect";
import {ForbiddenError, NotFoundError, onError} from "../../../../lib/error";
import {connectDBMiddleware} from "../../../../lib/db";
import {authMiddleware} from "../../../../lib/auth";
import Ticket from "../../../../models/ticket";
import {ticketFullDto} from "../../../../models/dtos/ticket";

const handler = nc({onError})
    .use(connectDBMiddleware)
    .use(authMiddleware('user', 'admin'))
    .get(async (req, res) => {
        const {uid} = req.query;
        const ticket = await Ticket.findById(uid);
        if (!ticket) throw new NotFoundError("ticket.js not found");
        if (!ticket.user._id.equals(req.user._id)) throw new ForbiddenError("you are not allowed to view this ticket.js");
        res.status(200).json(ticketFullDto(ticket));
    });

export default handler;