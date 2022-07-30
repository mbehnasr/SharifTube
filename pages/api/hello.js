import nc from 'next-connect';
import {authMiddleware} from "../../lib/auth";

const handler = nc()
.use(authMiddleware())
.get(async (req, res) => {
    res.status(200).json({
        message: "Hello world"
    })
});

export default handler;