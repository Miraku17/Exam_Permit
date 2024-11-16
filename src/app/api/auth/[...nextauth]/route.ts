import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth"
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user"; 
import bcrypt from "bcryptjs";

const handler = NextAuth({

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password", placeholder: "********" }
            },
            async authorize(credentials, req) {
                await connectDB();
                console.log(credentials);

                const userFound = await User.findOne({ email: credentials.email }).select("+password");
                if (!userFound) throw new Error("Invalid credentials");

                const passwordMatch = await bcrypt.compare(credentials.password, userFound.password);
                if (!passwordMatch) throw new Error("Invalid credentials");

                console.log(userFound);

                return userFound;
            },
        }),
    ],
    callbacks: {
        jwt({account, token, user, profile, session}) {
            if (user) token.user = user;
            return token;
        },
        session({session, token}) {
            session.user = token.user as any;
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
});

export { handler as GET, handler as POST }