"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function NewJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  // 🔤 Otomatis generate slug dari title
  useEffect(() => {
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setSlug(generatedSlug);
  }, [title]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("jobs").insert([
      {
        title,
        slug,
        description,
        requirements,
        department,
        location,
        active,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("❌ Gagal menambahkan lowongan: " + error.message);
    } else {
      alert("✅ Lowongan berhasil ditambahkan!");
      router.push("/admin/dashboard");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Tambah Lowongan Baru</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Judul */}
        <div>
          <label className="block font-semibold mb-1">Judul Lowongan</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded-lg"
            placeholder="Contoh: Guru Matematika"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block font-semibold mb-1">Slug (otomatis)</label>
          <input
            type="text"
            value={slug}
            readOnly
            className="w-full border p-2 rounded-lg bg-gray-100 text-gray-600"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block font-semibold mb-1">Departemen</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full border p-2 rounded-lg"
            placeholder="Contoh: Akademik / Administrasi / IT"
          />
        </div>

        {/* Lokasi */}
        <div>
          <label className="block font-semibold mb-1">Lokasi</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border p-2 rounded-lg"
            placeholder="Contoh: Bandung / Jakarta"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block font-semibold mb-1">Deskripsi</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full border p-2 rounded-lg"
            placeholder="Tuliskan deskripsi pekerjaan..."
          ></textarea>
        </div>

        {/* Persyaratan */}
        <div>
          <label className="block font-semibold mb-1">Persyaratan</label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows="4"
            className="w-full border p-2 rounded-lg"
            placeholder="Tuliskan persyaratan pekerjaan..."
          ></textarea>
        </div>

        {/* Status aktif */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            id="active"
          />
          <label htmlFor="active" className="font-medium">
            Lowongan Aktif
          </label>
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white font-semibold py-2 rounded-lg ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Menyimpan..." : "Simpan Lowongan"}
        </button>
      </form>
    </div>
  );
}
