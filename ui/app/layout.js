import localFont from "next/font/local";
import "./globals.css";

const AnekBangla = localFont({
  src: "./fonts/AnekBangla.ttf",
  variable: "--font-anekbangla",
  weight: "100 900",
});

export const metadata = {
  title: "KLEIN-V1",
  description: "KLEIN-V1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${AnekBangla.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
