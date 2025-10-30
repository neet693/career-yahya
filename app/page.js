"use client";
import supabase from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("active", true)
        .order("posted_at", { ascending: false });

      if (error) setError(error);
      else setJobs(data || []);
    }

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ===== Main Content ===== */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
          Lowongan Pekerjaan
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Sekolah Kristen Yahya membuka kesempatan bagi Anda yang ingin
          berkembang bersama kami.
        </p>

        {error ? (
          <p className="text-center text-red-500">
            Gagal memuat data lowongan: {error.message}
          </p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-600">
            Belum ada lowongan tersedia.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Link
                key={job.slug}
                href={`/job/${job.slug}`}
                className="block bg-white p-5 border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-300 transition-all duration-200"
              >
                <h3 className="text-lg font-semibold text-blue-700">
                  {job.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {job.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
                  <span>{job.location || "Lokasi tidak disebutkan"}</span>
                  <span>
                    {new Date(job.posted_at).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* ===== Footer ===== */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Sekolah Kristen Yahya — Career Portal
      </footer>
    </div>
  );
}
