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
        const excludeRoles = ['manager'];
        if (!req.user.roles.includes('manager')) excludeRoles.push('admin');
        if (username) {
                const user = await User.findOne({username, roles: {$not: {$in: excludeRoles}}});
                if (!user) throw new NotFoundError("user not found or you are not allowed to view user details");
                res.status(200).json(userAdminDto(user));
        } else {
            const users = await User.find({roles: {$not: {$in: excludeRoles}}});
            res.status(200).json(users.map(user => userAdminDto(user)));
        }
    });

export default handler;