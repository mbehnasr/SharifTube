import {compare, hash} from "bcrypt";
import {getToken} from "next-auth/jwt";
import {userSerializer} from "../models/dtos/user";
import User from "../models/user";

export async function hashPassword(password) {
    return hash(password, 10)
}

export async function verifyPassword(password, hash) {
    return compare(password, hash)
}

/**
 * checks user has required roles for access this endpoint
 * @param roles
 * @return {(function(*, *, *): Promise<void>)|*}
 */
export function authMiddleware(...roles) {
    return async (req, res, next) => {
        const token = await getToken({req});
        if (token) {
            req.user = userSerializer(token);
            if (roles.length === 0 || req.user.roles.some(role => roles.includes(role))) next();
            else res.status(403).json({message: "you are not allowed to access this endpoint"});
        } else res.status(401).json({message: "unauthorized"});
    }
}

export function strikeAuthMiddleware(...roles) {
    return async (req, res, next) => {
        const token = await getToken({req});
        if (token) {
            let message;
            req.user = await User.findById(token.sub);
            if (roles.length !== 0 && !req.user.roles.some(role => roles.includes(role))) message = "you has not permission to access this endpoint";
            else if (req.user.roles.includes('user') && req.user.strike) message = "you are in strike";
            else if (req.user.roles.includes('admin') && !req.user.verified) message = "you are not verified";
            else next();
            if (message) res.status(403).json({message});
        } else res.status(401).json({message: "unauthorized"});
    }
}

export async function withUser(req, res, next) {
    const token = await getToken({req});
    if (token) req.user = userSerializer(token)
    else req.user = null;
    next();
}

export async function getUser(context) {
    const token = await getToken(context);
    if (token) return userSerializer(token)
    else return null;
}

export async function getFullUser(context) {
    const token = await getToken(context);
    if (token) return User.findById(token.sub);
    else return null;
}