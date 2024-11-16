import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password", placeholder: "********" }
            },
            async authorize(credentials, req) {
                await connectDB();
                
                const userFound = await User.findOne({ email: credentials.email }).select("+password");
                if (!userFound) throw new Error("Email doesn't exists");
                
                const passwordMatch = await bcrypt.compare(credentials.password, userFound.password);
                if (!passwordMatch) throw new Error("Wrong password");
                
                // Don't send the password in the session
                const userWithoutPassword = {
                    _id: userFound._id.toString(),
                    email: userFound.email,
                    fullname: userFound.fullname,
                    course: userFound.course,
                    yearLevel: userFound.yearLevel
                };
                
                return userWithoutPassword;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user;
            return session;
        }
    },
    session: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
