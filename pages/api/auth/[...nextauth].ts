import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) {
    throw new Error("Missing env [...nextauth].ts");
}

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
        }),
        // ...add more providers here
    ],
})