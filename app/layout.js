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
    icon: "/favicon.ico", // ⬅️ Tambahkan baris ini
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {/* ✅ Navbar global muncul di semua halaman publik */}
        <NavbarGlobal />

        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
