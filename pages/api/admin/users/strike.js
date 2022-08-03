import nc from "next-connect";
import {authMiddleware} from "../../../../lib/auth";
import {connectDBMiddleware} from "../../../../lib/db";
import {NotFoundError, onError} from "../../../../lib/error";

const handler = nc({onError})
    .use(connectDBMiddleware)
    .use(authMiddleware('admin'))
    .delete(async (req, res) => {
        const {username} = req.body;
        const user = await User.findOne({username});
        if (!user) throw new NotFoundError("user not found");
        user.strike = false;
        await user.save();
        res.status(204).end();
    });

export default handler;