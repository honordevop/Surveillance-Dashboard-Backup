// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("User does not exist");
        }

        // Check password
        const valid = await compare(credentials.password, user.password);
        if (!valid) {
          throw new Error("Wrong Credentials");
        }

        // Return safe user object (this goes into the JWT)
        return {
          id: String(user.id),
          name: user.name || null,
          email: user.email,
          role: user.role,
          corridor: user.corridor || null,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.corridor = user.corridor;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      session.user.role = token.role || session.user.role;
      session.user.corridor = token.corridor || session.user.corridor;
      session.user.email = token.email || session.user.email;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
