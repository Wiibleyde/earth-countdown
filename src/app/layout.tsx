import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { ClientProvider } from './clientProvider';
import { Footer } from '@/components/Footer';
import { DbInitializer } from '@/components/DbInitializer';

export const metadata: Metadata = {
    title: 'Earth Countdown',
    description: 'Une échéance adaptable pour un avenir durable.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body className={`antialiased bg-primary-background text-primary min-h-screen`}>
                {/* Composant qui s'assure que la DB est initialisée côté serveur */}
                <DbInitializer />
                <ClientProvider>
                    <Navbar />
                    {children}
                    <Footer />
                </ClientProvider>
            </body>
        </html>
    );
}
