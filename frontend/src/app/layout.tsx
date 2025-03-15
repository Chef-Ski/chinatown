import type { Metadata } from "next";
import { Quintessential } from "next/font/google";
import "./globals.css";
import Navbar from "./component/Navbar";



const quint = Quintessential({
  variable: "--font-quintessential",
  weight: "400",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Story Vault",
  description: "Preserving stories, bridging generations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quint.variable} antialiased`} style={{ fontFamily: "var(--font-quintessential)" }}>

        <Navbar/>
        {children}
      </body>
    </html>
  );
}
