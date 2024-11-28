// pages/_app.js
import React from 'react';
import localFont from 'next/font/local';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/contexts/sidebar-context';

const AnekBangla = localFont({
    src: './fonts/AnekBangla.ttf',
    weight: '100 900',
    className: 'font-anekbangla',
});

function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <SidebarProvider>
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
            </SidebarProvider>
        </ThemeProvider>
    );
}

export default MyApp;
