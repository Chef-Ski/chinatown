import type { Metadata } from "next";
import { Delius } from "next/font/google";
import "./globals.css";
import Navbar from "./component/Navbar";


const delius = Delius({
  variable: "--font-delius",
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
      <body
        className={`${delius.variable} antialiased`}
      >
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
