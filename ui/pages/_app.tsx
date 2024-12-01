import "@/styles/globals.css";
import localFont from "next/font/local";
import type { AppProps } from "next/app";
import { useEffect } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context";
import Sidebar from "@/components/sidebar";

const AnekBangla = localFont({
  src: "./fonts/AnekBangla.ttf",
  weight: "100 900",
});

function AppContent({ Component, pageProps }: AppProps) {
  const { setHasUpdate } = useSidebar();

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasUpdate(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [setHasUpdate]);

  return (
    <div className={`${AnekBangla.className} antialiased`}>
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

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
    >
      <SidebarProvider>
        <AppContent
          Component={Component}
          pageProps={pageProps}
          router={router}
        />
      </SidebarProvider>
    </ThemeProvider>
  );
}
