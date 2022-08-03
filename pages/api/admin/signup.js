import nc from "next-connect";
import {connectDBMiddleware} from "../../../lib/db";
import User from "../../../models/user";
import {hashPassword} from "../../../lib/auth";

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
        res.status(201).json({
            id: user._id, username: user.username,
        })
    })

export default handler;