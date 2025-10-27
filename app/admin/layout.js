"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setLoading(false);

      // Jika bukan halaman login dan tidak ada session → redirect
      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Gagal logout: " + error.message);
    } else {
      setSession(null);
      router.push("/admin/login");
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-500">Memuat...</div>;
  }

  // 💡 Jika sedang di halaman login → jangan tampilkan navbar admin
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // 💡 Jika tidak login dan bukan halaman login → tampilkan kosong
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-semibold">🎓 Admin Career Yahya</h1>
        <div className="space-x-4">
          <Link href="/admin/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/admin/jobs/new" className="hover:underline">
            Tambah Lowongan
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="p-6">{children}</main>
    </div>
  );
}
