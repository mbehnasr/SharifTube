import nc from "next-connect";
import {connectDBMiddleware} from "../../../lib/db";
import {authMiddleware} from "../../../lib/auth";
import {BadRequestError, onError} from "../../../lib/error";
import Ticket from "../../../models/ticket";
import {ticketFullDto, ticketListDto} from "../../../models/dtos/ticket";

const handler = nc({onError})
    .use(connectDBMiddleware)
    .use(authMiddleware('user', 'admin'))
    .post(async (req, res) => {
        const {title, content} = req.body;
        if (!title || !content) throw new BadRequestError("title and content are required");
        const ticket = await Ticket.create({
            title,
            content,
            user: {
                _id: req.user._id,
                username: req.user.username
            },
            activeRole: req.user.roles[0]
        });
        res.status(201).json(ticketFullDto(ticket));
    }).get(async (req, res) => {
        const tickets = await Ticket.find({"user._id": req.user._id});
        res.status(200).json(tickets.map(ticket => ticketListDto(ticket)));
    });

export default handler;