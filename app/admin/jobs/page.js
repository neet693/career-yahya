"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "@/lib/supabaseClient";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("posted_at", { ascending: false });
      if (error) console.error(error);
      else setJobs(data || []);
      setLoading(false);
    };

    fetchJobs();
  }, []);

  const handleDelete = async (slug) => {
    if (confirm("Yakin ingin menghapus lowongan ini?")) {
      const { error } = await supabase.from("jobs").delete().eq("slug", slug);
      if (error) alert("Gagal menghapus data!");
      else {
        alert("Lowongan berhasil dihapus!");
        setJobs(jobs.filter((job) => job.slug !== slug));
      }
    }
  };

  if (loading) return <p className="p-8 text-gray-600">Memuat data...</p>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Lowongan</h1>
        <Link
          href="/admin/jobs/new"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Tambah Lowongan
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-600">Belum ada lowongan yang dibuat.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-3 px-4 border-b">Judul</th>
                <th className="py-3 px-4 border-b">Lokasi</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.slug} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{job.title}</td>
                  <td className="py-3 px-4 border-b">{job.location || "-"}</td>
                  <td className="py-3 px-4 border-b">
                    {job.active ? (
                      <span className="text-green-600 font-medium">Aktif</span>
                    ) : (
                      <span className="text-gray-500 font-medium">
                        Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 border-b text-right space-x-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/jobs/edit/${job.slug}`)
                      }
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job.slug)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
