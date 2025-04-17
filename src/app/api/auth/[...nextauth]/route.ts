import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"

const handler = NextAuth({
    providers: [
        Discord({
            clientId: process.env.DISCORD_CLIENT_ID || "",
            clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
})

export { handler as GET, handler as POST }