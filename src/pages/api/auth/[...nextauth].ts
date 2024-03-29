import NextAuth, {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";
import Trpc from "../trpc/[...trpc].js";
import { ClassRegistry } from "superjson/dist/class-registry.js";
import bcrypt from 'bcryptjs'



export const authOptions: NextAuthOptions = {
  session:{
    strategy: 'jwt'
  },
  pages: {
    signIn: "/index",
    error: "/"
  },
  callbacks: {
    async jwt({user, token}){
      if(user){
        token.user = user;
      }
      return Promise.resolve(token);
    },
    session: async ({ session, token}) => {
      session.user = token.user
      return Promise.resolve(session);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "username"},
        password: { label: "Password", type: "password"}
      },
      async authorize(credentials, req) {
        const user = await prisma.user.findFirst({
          where: { name: credentials.username},
        })
        if (!user){
          throw new Error("Username does not exist.")
          return null
        }
        if (credentials && credentials.password){
          const isValidPassword = bcrypt.compareSync(
            credentials.password,
            user.password
          );
          if (!isValidPassword) {
            throw new Error("Invalid Password")
          }
          return user;
        }
        else{
          throw new Error("Please Enter a Password")
        }

      }
    })
  ]
};

export default NextAuth(authOptions);
