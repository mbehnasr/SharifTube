import nc from "next-connect";
import {authMiddleware} from "../../../../../lib/auth";
import {connectDBMiddleware} from "../../../../../lib/db";
import {BadRequestError, NotFoundError, onError} from "../../../../../lib/error";
import User from "../../../../../models/user";
import {userAdminDto, userLightDto} from "../../../../../models/dtos/user";

const handler = nc({onError})
    .use(connectDBMiddleware)
    .use(authMiddleware('admin'))
    .post(async (req, res) => {
        const {uid} = req.query;
        const user = await User.findById(uid);
        if (!user) throw new NotFoundError("user not found");
        if (!user.roles.includes('admin')) throw new BadRequestError("user is not admin");
        if (user.verified) throw new BadRequestError("user is not in strike");
        user.verified = true;
        await user.save();
        res.status(200).json(userAdminDto(user));
    });

export default handler;