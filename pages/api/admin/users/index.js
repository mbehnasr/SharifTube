import nc from "next-connect";
import {connectDBMiddleware} from "../../../../lib/db";
import {authMiddleware} from "../../../../lib/auth";
import {BadRequestError, NotFoundError, onError} from "../../../../lib/error";
import User from "../../../../models/user";
import {userAdminDto} from "../../../../models/dtos/user";

const handler = nc({onError})
    .use(connectDBMiddleware)
    .use(authMiddleware('admin'))
    .get(async (req, res) => {
        const username = req.query.username;
        if (!username) throw new BadRequestError("username is required");
        const user = await User.findOne({username, roles: {$not: {$in: ['admin', 'manager']}}});
        if (!user) throw new NotFoundError("user not found or you are not allowed to view user details");
        res.status(200).json(userAdminDto(user));
    });

export default handler;