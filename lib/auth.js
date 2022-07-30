import {compare, hash} from "bcrypt";
import {getToken} from "next-auth/jwt";

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
            req.user = {
                _id: token.sub,
                username: token.username,
                roles: token.roles,
            }
            if (roles.length === 0 || req.user.roles.some(role => roles.includes(role))) next();
            else res.status(403).json({message: "you are not allowed to access this endpoint"});
        } else res.status(401).json({message: "unauthorized"});
    }
}