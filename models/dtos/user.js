import {Types} from "mongoose";

export function userSerializer(token) {
    return {
        _id: Types.ObjectId(token.sub),
        username: token.username,
        roles: token.roles,
    };
}