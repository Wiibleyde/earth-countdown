"use client"
import { signIn } from "next-auth/react"
import { Discord } from "react-bootstrap-icons"

export function DiscordSign() {
    return (
        <button
            className="flex items-center justify-center px-4 py-2 bg-discord text-white rounded-md hover:bg-discord/90 transition-colors duration-200 shadow-sm"
            onClick={() => {signIn("discord", {})}}
            aria-label="Se connecter avec Discord"
            title="Se connecter avec Discord"
        >
            <Discord className="mr-2" />
            Connexion avec Discord
        </button>
    )
}