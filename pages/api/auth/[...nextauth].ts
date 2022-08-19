import NextAuth, { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) {
    throw new Error("Missing env [...nextauth].ts");
}

const prisma = new PrismaClient()
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
        }),
        // ...add more providers here
    ],
}


export default NextAuth(
    // Configure one or more authentication providers
    authOptions
)