import nc from "next-connect";
import {onError} from "../../../../lib/error";
import {connectDBMiddleware} from "../../../../lib/db";
import {authMiddleware} from "../../../../lib/auth";
import Ticket, {TicketStatus} from "../../../../models/ticket";
import {ticketAdminListDto, ticketFullDto, ticketListDto} from "../../../../models/dtos/ticket";
import {Role} from "../../../../models/user";

const handler = nc({onError})
    .use(connectDBMiddleware)
    .use(authMiddleware('admin'))
    .get(async (req, res) => {
        const filter = {status: {$ne: TicketStatus.CLOSED}};
        if (req.user.roles.includes(Role.MANAGER)) filter.activeRole = Role.ADMIN;
        else if (req.user.roles.includes(Role.ADMIN)) filter.activeRole = Role.USER;
        const tickets = await Ticket.find(filter);
        res.status(200).json(tickets.map(ticket => ticketAdminListDto(ticket)));
    });

export default handler;