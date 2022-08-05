import nc from "next-connect";
import {NotFoundError, onError} from "../../../../lib/error";
import {connectDBMiddleware} from "../../../../lib/db";
import {authMiddleware} from "../../../../lib/auth";
import Ticket from "../../../../models/ticket";
import {ticketAdminFullDto} from "../../../../models/dtos/ticket";
import {Role} from "../../../../models/user";

const handler = nc({onError})
    .use(connectDBMiddleware)
    .use(authMiddleware(Role.ADMIN))
    .get(async (req, res) => {
        const {uid} = req.query;
        const ticket = await Ticket.findById(uid);
        if (!ticket) throw new NotFoundError("ticket.js not found");
        res.status(200).json(ticketAdminFullDto(ticket));
    })
    .put(async (req, res) => {
        const {uid} = req.query;
        const ticket = await Ticket.findById(uid);
        if (!ticket) throw new NotFoundError("ticket.js not found");
        const {answer, status} = req.body;
        ticket.answer = answer || ticket.answer;
        ticket.status = status || ticket.status;
        await ticket.save();
        res.status(200).json(ticketAdminFullDto(ticket));
    });

export default handler;