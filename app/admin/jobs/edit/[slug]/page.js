"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";

export default function EditJobPage({ params }) {
  // ✅ Di Next.js 15 params adalah Promise → gunakan React.use() untuk unwrap
  const { slug } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slugValue, setSlugValue] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  // 🔁 Ambil data awal berdasarkan slug
  useEffect(() => {
    async function fetchJob() {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        alert("❌ Gagal memuat data: " + error.message);
        return;
      }

      if (data) {
        setTitle(data.title);
        setSlugValue(data.slug);
        setDescription(data.description || "");
        setRequirements(data.requirements || "");
        setDepartment(data.department || "");
        setLocation(data.location || "");
        setActive(data.active);
      }
    }

    if (slug) fetchJob();
  }, [slug]);

  // 🔤 Auto generate slug dari title
  useEffect(() => {
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setSlugValue(generatedSlug);
  }, [title]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("jobs")
      .update({
        title,
        slug: slugValue,
        description,
        requirements,
        department,
        location,
        active,
      })
      .eq("slug", slug);

    setLoading(false);

    if (error) {
      alert("❌ Gagal memperbarui lowongan: " + error.message);
    } else {
      alert("✅ Lowongan berhasil diperbarui!");
      router.push("/admin/jobs");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Edit Lowongan</h1>

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
            value={slugValue}
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
          {loading ? "Menyimpan..." : "Perbarui Lowongan"}
        </button>
      </form>
    </div>
  );
}
