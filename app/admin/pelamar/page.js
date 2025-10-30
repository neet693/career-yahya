"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";

export default function PelamarPage() {
  const [pelamar, setPelamar] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPelamar = async () => {
      const { data, error } = await supabase
        .from("applier")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setPelamar(data);
    };
    fetchPelamar();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Daftar Pelamar</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left p-3">Nama</th>
              <th className="text-left p-3">Posisi</th>
              <th className="text-left p-3">Tanggal</th>
              <th className="text-left p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pelamar.length > 0 ? (
              pelamar.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.nama}</td>
                  <td className="p-3">{p.posisi}</td>
                  <td className="p-3">
                    {new Date(p.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => router.push(`/admin/pelamar/${p.id}`)}
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-gray-500" colSpan={4}>
                  Belum ada pelamar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
