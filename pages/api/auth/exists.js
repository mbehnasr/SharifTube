import nc from "next-connect";
import {connectDBMiddleware} from "../../../lib/db";
import User from "../../../models/user";

const handler = nc()
    .use(connectDBMiddleware)
    .get(async (req, res) => {
        const {username} = req.query;
        const user = await User.findOne({username});
        if (!user) {
            res.status(404).end();
            return;
        }
        res.status(204).end();
    });

export default handler;