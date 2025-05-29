import { login } from "../../api/backendClient";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "google" && account.id_token) {
        try {
          const { response, data } = await login({ token: account.id_token });
          if (!response.ok) {
            throw new Error("Login failed");
          }
          if (response.ok && data?.access) {
            token.sessionToken = data.access;
          }
        } catch (error) {
          console.error("Error during login:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (!token?.sessionToken) throw new Error("Missing sessionToken");

      session.sessionToken = token.sessionToken as string;
      return session;
    },
  },
};
