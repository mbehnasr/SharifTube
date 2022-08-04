import nc from "next-connect";
import {authMiddleware} from "../../../../../lib/auth";
import {connectDBMiddleware} from "../../../../../lib/db";
import {BadRequestError, NotFoundError, onError} from "../../../../../lib/error";
import User from "../../../../../models/user";
import {userAdminDto, userLightDto} from "../../../../../models/dtos/user";

const handler = nc({onError})
    .use(connectDBMiddleware)
    .use(authMiddleware('admin'))
    .delete(async (req, res) => {
        const {uid} = req.query;
        const user = await User.findById(uid);
        if (!user) throw new NotFoundError("user not found");
        if (!user.strike) throw new BadRequestError("user is not in strike");
        user.strike = false;
        await user.save();
        res.status(200).json(userAdminDto(user));
    });

export default handler;