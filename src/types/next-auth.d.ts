import NextAuth from "next-auth"; // eslint-disable-line
import { JWT } from "next-auth/jwt"; // eslint-disable-line

declare module "next-auth" {
  interface Session {
    sessionToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sessionToken?: string;
  }
}
