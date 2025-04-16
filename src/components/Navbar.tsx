"use client"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { LogoutIcon } from "./Icons/Logout"

export function Navbar() {
    const session = useSession()

    return (
        <nav className="sticky top-0 z-50 h-15 flex items-center justify-between px-6 py-4 bg-secondary-background shadow-md text-accent">
            <Link href={"/"} className="text-xl font-bold tracking-tight hover:text-primary transition-colors duration-200">
                Earth Countdown
            </Link>
            <div>
                {session.status === "loading" ? (
                    <p className="animate-pulse">Chargement...</p>
                ) : session.status === "authenticated" ? (
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Image
                                src={session.data?.user?.image || ""}
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full border-2 border-primary"
                                width={40}
                                height={40}
                            />
                            <span className="font-medium capitalize">{session.data?.user?.name}</span>
                        </div>
                        <Link
                            href="/api/auth/signout"
                            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-all duration-200"
                            aria-label="Se déconnecter"
                            title="Se déconnecter"
                        >
                            <LogoutIcon />
                        </Link>
                    </div>
                ) : (
                    <Link 
                        href="/api/auth/signin"
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-200 shadow-sm"
                    >
                        Se connecter
                    </Link>
                )}
            </div>
        </nav>
    )
}