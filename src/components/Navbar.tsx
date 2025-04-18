'use client';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Person } from 'react-bootstrap-icons';

export function Navbar() {
    const session = useSession();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 h-15 flex items-center justify-between px-6 py-4 bg-secondary-background shadow-md text-accent">
            <Link
                href={'/'}
                className="text-xl font-bold tracking-tight hover:text-primary transition-colors duration-200"
            >
                Earth Countdown
            </Link>
            <div className="flex items-center space-x-4">
                <Link
                    href={'/leaderboard'}
                    className="text-sm font-medium tracking-tight hover:text-primary transition-colors duration-200"
                >
                    Classement
                </Link>
                {session.status === 'authenticated' && (
                    <Link
                        href={'/countdown'}
                        className="text-sm font-medium tracking-tight hover:text-primary transition-colors duration-200"
                    >
                        Countdown
                    </Link>
                )}
            </div>
            <div>
                {session.status === 'loading' ? (
                    <p className="animate-pulse">Chargement...</p>
                ) : session.status === 'authenticated' ? (
                    <div
                        className="relative"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => {
                            setTimeout(() => {
                                setIsDropdownOpen(false);
                            }, 100);
                        }}
                    >
                        <div className="flex items-center space-x-4 cursor-pointer">
                            <div className="flex items-center space-x-2">
                                <Image
                                    src={session.data?.user?.image || ''}
                                    alt="User Avatar"
                                    className="w-10 h-10 rounded-full border-2 border-primary"
                                    width={40}
                                    height={40}
                                />
                                <span className="font-medium capitalize">{session.data?.user?.name}</span>
                            </div>
                        </div>

                        {/* Dropdown Menu - Positioned without a gap */}
                        <div className="absolute right-0 top-full">
                            {isDropdownOpen && (
                                <div className="w-56 bg-secondary-background rounded-lg shadow-xl py-2 z-50 border border-primary/30 mt-2 transform origin-top-right transition-all duration-200 ease-out overflow-hidden">
                                    <Link
                                        href="/profile"
                                        className="px-4 py-3 text-sm text-accent hover:bg-primary-background/20 hover:text-white flex items-center space-x-2 transition-colors duration-150"
                                    >
                                        <Person size={20} className="text-accent" />
                                        <span>Profile</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            signOut();
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm text-red-300 hover:bg-red-500 hover:text-white flex items-center space-x-2 transition-colors duration-150"
                                    >
                                        <span>Déconnexion</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-200 shadow-sm"
                    >
                        Se connecter
                    </Link>
                )}
            </div>
        </nav>
    );
}
