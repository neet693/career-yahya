"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarGlobal() {
  const pathname = usePathname();

  // Sembunyikan navbar di halaman admin
  const isAdminPage = pathname.startsWith("/admin");
  if (isAdminPage) return null;

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md">
      <Link
        href="/"
        className="text-xl font-semibold text-blue-700 flex items-center gap-2"
      >
        🎓 <span>Yahya Career</span>
      </Link>

      <div className="space-x-3">
        <Link
          href="/signin"
          className="text-gray-700 hover:text-blue-700 font-medium transition"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
