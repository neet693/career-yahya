"use client";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalLowongan: 0,
    totalPelamar: 0,
    lamaranAktif: 0,
    lamaranDitolak: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Ambil total lowongan
        const { count: totalLowongan } = await supabase
          .from("jobs")
          .select("*", { count: "exact" });

        // Ambil total pelamar
        const { count: totalPelamar } = await supabase
          .from("pelamar")
          .select("*", { count: "exact" });

        // Ambil lamaran aktif
        const { count: lamaranAktif } = await supabase
          .from("lamaran")
          .select("*", { count: "exact" })
          .eq("status", "Aktif");

        // Ambil lamaran ditolak
        const { count: lamaranDitolak } = await supabase
          .from("lamaran")
          .select("*", { count: "exact" })
          .eq("status", "Ditolak");

        setStats({
          totalLowongan: totalLowongan || 0,
          totalPelamar: totalPelamar || 0,
          lamaranAktif: lamaranAktif || 0,
          lamaranDitolak: lamaranDitolak || 0,
        });
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Lowongan",
      value: stats.totalLowongan,
      color: "bg-blue-500",
      emoji: "💼",
    },
    {
      title: "Total Pelamar",
      value: stats.totalPelamar,
      color: "bg-green-500",
      emoji: "🧑‍💼",
    },
    {
      title: "Lamaran Aktif",
      value: stats.lamaranAktif,
      color: "bg-yellow-500",
      emoji: "📬",
    },
    {
      title: "Lamaran Ditolak",
      value: stats.lamaranDitolak,
      color: "bg-red-500",
      emoji: "❌",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`${card.color} text-white p-6 rounded-2xl shadow-md transition-transform hover:scale-105`}
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl">{card.emoji}</span>
              <span className="text-4xl font-bold">{card.value}</span>
            </div>
            <p className="mt-3 text-lg font-semibold">{card.title}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Ringkasan Aktivitas
        </h2>
        <p className="text-gray-600 text-sm">
          Selamat datang di halaman admin karier Yahya! Di sini kamu dapat
          memantau jumlah lowongan, pelamar, serta status lamaran dengan mudah.
          Gunakan menu di atas untuk menambah atau mengedit lowongan pekerjaan.
        </p>
      </div>
    </div>
  );
}
