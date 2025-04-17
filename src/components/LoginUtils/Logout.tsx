'use client';
import { signOut } from 'next-auth/react';
import { BoxArrowRight } from 'react-bootstrap-icons';

export function LogoutButton() {
    return (
        <button
            className="flex items-center justify-center rounded-full p-2"
            onClick={() => {
                signOut({});
            }}
            title="Se déconnecter"
            aria-label="Se déconnecter"
        >
            <BoxArrowRight size={24} className="text-red-500 hover:text-red-100 transition-all duration-200" />
        </button>
    );
}
