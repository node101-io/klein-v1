import localFont from 'next/font/local';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/contexts/sidebar-context';

const AnekBangla = localFont({
  src: './fonts/AnekBangla.ttf',
  variable: '--font-anekbangla',
  weight: '100 900',
});

export const metadata = {
  title: 'KLEIN-V1',
  description: 'KLEIN-V1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${AnekBangla.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SidebarProvider>
            <div className="flex h-screen dark:text-white text-black">
              <div className="w-full flex gap-x-4 p-10">
                <Sidebar />
                <div className="flex-1 flex">
                  <main className="flex-1">{children}</main>
                </div>
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
