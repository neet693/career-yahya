import { Geist, Geist_Mono } from "next/font/google";
import NavbarGlobal from "./components/navbarGlobal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Yahya Career",
  description: "Portal karier Yahya - Temukan dan kelola lowongan pekerjaan.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden flex flex-col`}
      >
        {/* Navbar */}
        <NavbarGlobal />

        {/* Main (ambil sisa ruang antara navbar & footer) */}
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Footer tetap di bawah tanpa menambah tinggi */}
        <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-4 text-center text-gray-600 text-sm shrink-0">
          © {new Date().getFullYear()} Sekolah Kristen Yahya — Career Portal
        </footer>
      </body>
    </html>
  );
}
