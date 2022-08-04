import {Types} from "mongoose";

export function userSerializer(token) {
    return {
        _id: Types.ObjectId(token.sub),
        username: token.username,
        roles: token.roles,
    };
}

export function userLightDto(user) {
    return {
        uid: user._id.toString(),
        username: user.username,
        roles: user.roles,
    }
}

export function userAdminDto(user) {
    return {
        uid: user._id.toString(),
        username: user.username,
        strike: user.strike,
    }
}