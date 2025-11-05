"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TerimaKasihPage() {
  const router = useRouter();

  // Setelah 5 detik otomatis balik ke halaman utama
  useEffect(() => {
    const timer = setTimeout(() => router.push("/"), 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md">
        <h1 className="text-3xl font-bold text-green-600 mb-3">
          🎉 Terima Kasih!
        </h1>
        <p className="text-gray-700 mb-6">
          Lamaran Anda telah berhasil dikirim. Kami akan meninjau dan
          menghubungi Anda bila sesuai dengan kriteria kami.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Kembali ke Beranda
        </button>
        <p className="text-sm text-gray-500 mt-3">
          Anda akan dialihkan otomatis dalam 5 detik...
        </p>
      </div>
    </div>
  );
}
