"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabaseClient";

export default function DetailPelamar() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openStep, setOpenStep] = useState(0); // step yang terbuka

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("applier")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setLoading(false);
      } else {
        setData(data);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return <p className="p-8 text-gray-500">Memuat data pelamar...</p>;
  if (!data)
    return <p className="p-8 text-red-500">Data pelamar tidak ditemukan.</p>;

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("id-ID") : "-";

  const getDocUrl = (path) => {
    if (!path) return null;
    return supabase.storage.from("berkas-lamaran").getPublicUrl(path).data
      .publicUrl;
  };

  const steps = [
    {
      title: "Informasi Pribadi",
      content: (
        <>
          <Row label="Nama" value={data.nama} />
          <Row label="Jenis Kelamin" value={data.jenis_kelamin} />
          <Row
            label="Tempat, Tanggal Lahir"
            value={`${data.tempat_lahir}, ${formatDate(data.tanggal_lahir)}`}
          />
          <Row label="Usia" value={data.usia} />
          <Row label="Status Pernikahan" value={data.status_pernikahan} />
          <Row label="Alamat" value={data.alamat} />
          <Row label="Nomor HP" value={data.no_hp} />
          <Row label="Email" value={data.email} />
          <Row label="Agama" value={data.agama} />
          {data.denominasi && (
            <Row label="Denominasi" value={data.denominasi} />
          )}
        </>
      ),
    },
    {
      title: "Pendidikan",
      content: (
        <>
          <Row label="Pendidikan Terakhir" value={data.pendidikan_terakhir} />
          <Row label="Jurusan" value={data.jurusan} />
          <Row label="Institusi" value={data.institusi} />
          <Row label="IPK" value={data.ipk} />
          <Row label="Tahun Lulus" value={data.tahun_lulus} />
        </>
      ),
    },
    {
      title: "Pengalaman Kerja",
      content: (
        <>
          <Row label="Pernah Bekerja" value={data.pernah_bekerja} />
          {data.pernah_bekerja === "Yes" && (
            <>
              <Row
                label="Perusahaan Terakhir"
                value={data.perusahaan_terakhir}
              />
              <Row label="Jabatan" value={data.jabatan} />
              <Row label="Lama Bekerja" value={data.lama_bekerja} />
              <Row label="Alasan Berhenti" value={data.alasan_berhenti} />
            </>
          )}
          <Row
            label="Pernah di Instansi Kristen"
            value={data.pernah_di_yahya}
          />
          {data.pernah_di_yahya === "Yes" && (
            <Row label="Pengalaman Yahya" value={data.pengalaman_yahya} />
          )}
        </>
      ),
    },
    {
      title: "Keterampilan & Kepribadian",
      content: (
        <>
          <Row label="Keterampilan" value={data.keterampilan} />
          <Row label="Bahasa" value={data.bahasa} />
          <Row label="Kepribadian" value={data.kepribadian} />
          <Row label="Tokoh Rohani" value={data.tokoh_rohani} />
          <Row label="Nilai Kekristenan" value={data.nilai_kristen} />
        </>
      ),
    },
    {
      title: "Posisi yang Dilamar",
      content: (
        <>
          <Row label="Posisi" value={data.posisi} />
          <Row label="Gaji Harapan" value={data.gaji_harapan} />
          <Row
            label="Tanggal Siap Bekerja"
            value={formatDate(data.tanggal_siap)}
          />
        </>
      ),
    },
    {
      title: "Pernyataan & Referensi",
      content: (
        <>
          <Row label="Alasan Bergabung" value={data.alasan_bergabung} />
          <Row label="Referensi" value={data.referensi} />
        </>
      ),
    },
    {
      title: "Dokumen",
      content: (
        <>
          {[
            { label: "CV", path: data.cv_path },
            { label: "Ijazah", path: data.ijazah_path },
            { label: "Transkrip Nilai", path: data.transkrip_path },
          ].map((doc) =>
            doc.path ? (
              <p key={doc.label}>
                <strong>{doc.label}:</strong>{" "}
                <a
                  href={getDocUrl(doc.path)}
                  target="_blank"
                  className="text-blue-600 underline"
                  rel="noopener noreferrer"
                >
                  Lihat {doc.label}
                </a>
              </p>
            ) : (
              <p key={doc.label}>
                <strong>{doc.label}:</strong> Tidak ada
              </p>
            )
          )}
        </>
      ),
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Detail Pelamar</h1>

      <div className="bg-white p-4 rounded-xl shadow divide-y">
        {steps.map((step, index) => (
          <div key={index}>
            <button
              onClick={() => setOpenStep(openStep === index ? -1 : index)}
              className="w-full text-left py-3 px-2 font-medium text-gray-700 hover:bg-gray-50 flex justify-between items-center"
            >
              {step.title}
              <span className="text-gray-400">
                {openStep === index ? "▲" : "▼"}
              </span>
            </button>
            {openStep === index && (
              <div className="px-4 pb-4">{step.content}</div>
            )}
          </div>
        ))}
        <p className="text-gray-400 text-sm mt-4">
          Tanggal Lamar: {formatDate(data.created_at)}
        </p>
      </div>
    </div>
  );
}

const Row = ({ label, value }) => (
  <p className="flex justify-between py-1">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-800">{value || "-"}</span>
  </p>
);
