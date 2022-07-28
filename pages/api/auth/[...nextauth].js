import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {db} from "../../../lib/db";
import User from "../../../models/user";
import {verifyPassword} from "../../../lib/auth";

export default NextAuth({
    session: {
        jwt: true,
    },
    providers: [
        Credentials({
            id: "user-password",
            async authorize(credentials) {
                await db();
                const {username, password} = credentials;
                const user = await User.findOne({username});
                if (!user || !(await verifyPassword(password, user.password))) {
                    throw new Error("Invalid credentials");
                }
                return user;
            }
        })
    ],
    callbacks: {
        async session({session, token}) {
            session.user.id = token.sub;
            return session;
        }
    }
});