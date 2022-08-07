import nc from "next-connect";
import {connectDBMiddleware} from "../../../lib/db";
import User from "../../../models/user";
import {hashPassword} from "../../../lib/auth";
import Ticket from "../../../models/ticket";

const handler = nc()
    .use(connectDBMiddleware)
    .post(async (req, res) => {
        const {username, password} = req.body;
        const userCheck = await User.findOne({username});
        if (userCheck) {
            res.status(400).json({errors: ["Username already exists.js"]});
            return;
        }
        const user = await User.create({username, password: await hashPassword(password), verified: false, roles: ["admin"]});
        await Ticket.create({
            title: "Admin vpn information",
            content: "Please send me vpn login information",
            answer: "Welcome to SharifTube you can download your open vpn file in attachments",
            user: {
                _id: user._id,
                username: user.username
            },
            activeRole: "admin"});
        res.status(201).json({
            id: user._id, username: user.username,
        })
    })

export default handler;