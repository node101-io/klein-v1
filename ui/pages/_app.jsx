import React, { useEffect } from 'react';
import localFont from 'next/font/local';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider, useSidebar } from '@/contexts/sidebar-context';

const AnekBangla = localFont({
    src: './fonts/AnekBangla.ttf',
    weight: '100 900',
    className: 'font-anekbangla',
});

function AppContent({ Component, pageProps }) {
    const { setHasUpdate } = useSidebar();

    useEffect(() => {
        const timer = setTimeout(() => {
            setHasUpdate(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, [setHasUpdate]);

    return (
        <div className={`${AnekBangla.variable} antialiased`}>
            <div className="flex h-screen dark:text-white text-black">
                <div className="w-full flex gap-x-4 p-10">
                    <Sidebar />
                    <div className="flex-1 flex">
                        <main className="flex-1">
                            <Component {...pageProps} />
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <SidebarProvider>
                <AppContent Component={Component} pageProps={pageProps} />
            </SidebarProvider>
        </ThemeProvider>
    );
}

export default MyApp;

