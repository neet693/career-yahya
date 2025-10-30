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
    </nav>
  );
}
