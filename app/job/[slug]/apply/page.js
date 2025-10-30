"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "@/lib/supabaseClient";

export default function ApplyPage({ params }) {
  const { slug } = use(params);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    // Step 1
    nama: "",
    jenis_kelamin: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    usia: "",
    status_pernikahan: "",
    alamat: "",
    no_hp: "",
    email: "",
    agama: "",
    denominasi: "",
    // Step 2
    pendidikan_terakhir: "",
    jurusan: "",
    institusi: "",
    ipk: "",
    tahun_lulus: "",
    // Step 3
    pernah_bekerja: "No",
    perusahaan_terakhir: "",
    jabatan: "",
    lama_bekerja: "",
    alasan_berhenti: "",
    pernah_di_yahya: "No",
    pengalaman_yahya: "",
    // Step 4
    cv_path: "",
    ijazah_path: "",
    transkrip_path: "",
    // Step 5
    keterampilan: "",
    bahasa: "",
    kepribadian: "",
    tokoh_rohani: "",
    nilai_kristen: "",
    // Step 6
    posisi: slug,
    gaji_harapan: "",
    tanggal_siap: "",
    // Step 7
    alasan_bergabung: "",
    referensi: "",
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "tanggal_lahir") {
        const birthDate = new Date(value);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs);
        updated.usia = Math.abs(ageDate.getUTCFullYear() - 1970);
      }

      return updated;
    });
  };

  // ✅ Upload File PDF ≤ 2MB ke bucket privat "dokumen"
  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi jenis dan ukuran file
    if (file.type !== "application/pdf") {
      alert("Hanya file PDF yang diperbolehkan!");
      e.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB!");
      e.target.value = "";
      return;
    }

    const filePath = `apply/${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from("berkas-lamaran")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      alert("Gagal upload: " + error.message);
    } else {
      setForm((prev) => ({ ...prev, [field]: filePath }));
      alert("File berhasil diunggah ✅");
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("applier").insert([
      {
        ...form,
        posisi: slug,
      },
    ]);

    setLoading(false);
    if (error) {
      alert("Gagal mengirim lamaran: " + error.message);
    } else {
      alert("Lamaran berhasil dikirim! 🙌");
      router.push("/terima-kasih");
    }
  }

  const steps = [
    { title: "Informasi Pribadi" },
    { title: "Informasi Pendidikan" },
    { title: "Pengalaman Kerja" },
    { title: "Dokumen Pendukung" },
    { title: "Keterampilan & Kepribadian" },
    { title: "Posisi yang Dilamar" },
    { title: "Pernyataan & Referensi" },
  ];

  return (
    <main className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">
        Formulir Lamaran
      </h1>
      <p className="text-gray-500 mb-6">
        Langkah {step} dari {steps.length} — {steps[step - 1].title}
      </p>

      <form
        onSubmit={handleSubmit}
        className="relative bg-white p-6 rounded-xl shadow-md overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {/* STEP 1: Informasi Pribadi */}
            {step === 1 && (
              <>
                <StepTitle>1️⃣ Informasi Pribadi</StepTitle>
                <Input
                  label="Nama Lengkap"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  required
                />
                <Select
                  label="Jenis Kelamin"
                  name="jenis_kelamin"
                  value={form.jenis_kelamin}
                  onChange={handleChange}
                  options={["Laki-laki", "Perempuan"]}
                />
                <Input
                  label="Tempat Lahir"
                  name="tempat_lahir"
                  value={form.tempat_lahir}
                  onChange={handleChange}
                />
                <Input
                  label="Tanggal Lahir"
                  type="date"
                  name="tanggal_lahir"
                  value={form.tanggal_lahir}
                  onChange={handleChange}
                />
                <Input label="Usia" name="usia" value={form.usia} readOnly />
                <Select
                  label="Status Pernikahan"
                  name="status_pernikahan"
                  value={form.status_pernikahan}
                  onChange={handleChange}
                  options={["Belum Menikah", "Menikah", "Duda/Janda"]}
                />
                <Input
                  label="Alamat Lengkap"
                  name="alamat"
                  value={form.alamat}
                  onChange={handleChange}
                />
                <Input
                  label="Nomor HP"
                  name="no_hp"
                  value={form.no_hp}
                  onChange={handleChange}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
                <Select
                  label="Agama"
                  name="agama"
                  value={form.agama}
                  onChange={handleChange}
                  options={[
                    "Kristen",
                    "Katolik",
                    "Islam",
                    "Hindu",
                    "Budha",
                    "Lainnya",
                  ]}
                />
                {["Kristen", "Katolik"].includes(form.agama) && (
                  <Input
                    label="Denominasi Gereja"
                    name="denominasi"
                    value={form.denominasi}
                    onChange={handleChange}
                  />
                )}
              </>
            )}

            {/* STEP 2: Pendidikan */}
            {step === 2 && (
              <>
                <StepTitle>2️⃣ Informasi Pendidikan</StepTitle>
                <Select
                  label="Pendidikan Terakhir"
                  name="pendidikan_terakhir"
                  value={form.pendidikan_terakhir}
                  onChange={handleChange}
                  options={["SMA", "D3", "S1", "S2", "S3"]}
                />
                <Input
                  label="Jurusan"
                  name="jurusan"
                  value={form.jurusan}
                  onChange={handleChange}
                />
                <Input
                  label="Nama Institusi"
                  name="institusi"
                  value={form.institusi}
                  onChange={handleChange}
                />
                <Input
                  label="IPK Terakhir (1.00 - 4.00)"
                  name="ipk"
                  type="number"
                  step="0.01"
                  min="1"
                  max="4"
                  value={form.ipk}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="tahun_lulus"
                  value={formData.tahun_lulus}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, ""); // hanya angka
                    setFormData({ ...formData, tahun_lulus: val });
                  }}
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="Tahun Lulus (contoh: 2022)"
                  className="input"
                />
              </>
            )}

            {/* STEP 3: Pengalaman Kerja */}
            {step === 3 && (
              <>
                <StepTitle>3️⃣ Pengalaman Kerja</StepTitle>
                <Select
                  label="Pernah Bekerja?"
                  name="pernah_bekerja"
                  value={form.pernah_bekerja}
                  onChange={handleChange}
                  options={["Yes", "No"]}
                />
                {form.pernah_bekerja === "Yes" && (
                  <>
                    <Input
                      label="Perusahaan Terakhir"
                      name="perusahaan_terakhir"
                      value={form.perusahaan_terakhir}
                      onChange={handleChange}
                    />
                    <Input
                      label="Jabatan / Posisi"
                      name="jabatan"
                      value={form.jabatan}
                      onChange={handleChange}
                    />
                    <Input
                      label="Lama Bekerja"
                      name="lama_bekerja"
                      value={form.lama_bekerja}
                      onChange={handleChange}
                    />
                    <Input
                      label="Alasan Berhenti"
                      name="alasan_berhenti"
                      value={form.alasan_berhenti}
                      onChange={handleChange}
                    />
                  </>
                )}
                <Select
                  label="Pernah bekerja di instansi pendidikan Kristen?"
                  name="pernah_di_yahya"
                  value={form.pernah_di_yahya}
                  onChange={handleChange}
                  options={["Yes", "No"]}
                />
                {form.pernah_di_yahya === "Yes" && (
                  <Textarea
                    label="Ceritakan pengalaman Anda"
                    name="pengalaman_yahya"
                    value={form.pengalaman_yahya}
                    onChange={handleChange}
                  />
                )}
              </>
            )}

            {/* STEP 4: Dokumen */}
            {step === 4 && (
              <>
                <StepTitle>4️⃣ Dokumen Pendukung</StepTitle>
                <FileInput
                  label="Upload CV (PDF maks 2MB)"
                  onChange={(e) => handleFileUpload(e, "cv_path")}
                />
                <FileInput
                  label="Upload Ijazah (PDF maks 2MB)"
                  onChange={(e) => handleFileUpload(e, "ijazah_path")}
                />
                <FileInput
                  label="Upload Transkrip Nilai (PDF maks 2MB)"
                  onChange={(e) => handleFileUpload(e, "transkrip_path")}
                />
              </>
            )}

            {/* STEP 5: Keterampilan */}
            {step === 5 && (
              <>
                <StepTitle>5️⃣ Keterampilan & Kepribadian</StepTitle>
                <Textarea
                  label="Keterampilan (Gunakan bullet point)"
                  name="keterampilan"
                  value={form.keterampilan}
                  onChange={handleChange}
                />
                <Textarea
                  label="Bahasa yang Dikuasai"
                  name="bahasa"
                  value={form.bahasa}
                  onChange={handleChange}
                />
                <Textarea
                  label="Kepribadian Anda"
                  name="kepribadian"
                  value={form.kepribadian}
                  onChange={handleChange}
                />
                <Textarea
                  label="Tokoh Rohani Panutan & Alasannya"
                  name="tokoh_rohani"
                  value={form.tokoh_rohani}
                  onChange={handleChange}
                />
                <Textarea
                  label="Nilai-nilai Kekristenan yang Anda Pegang"
                  name="nilai_kristen"
                  value={form.nilai_kristen}
                  onChange={handleChange}
                />
              </>
            )}

            {/* STEP 6: Posisi */}
            {step === 6 && (
              <>
                <StepTitle>6️⃣ Posisi yang Dilamar</StepTitle>
                <Input
                  label="Posisi"
                  name="posisi"
                  value={form.posisi}
                  readOnly
                />
                <input
                  type="number"
                  name="gaji_harapan"
                  value={formData.gaji_harapan}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, gaji_harapan: val });
                  }}
                  min="0"
                  step="500000"
                  placeholder="Gaji Harapan (contoh: 5000000)"
                  className="input"
                />

                <Input
                  label="Tanggal Siap Bekerja"
                  type="date"
                  name="tanggal_siap"
                  value={form.tanggal_siap}
                  onChange={handleChange}
                />
              </>
            )}

            {/* STEP 7: Pernyataan */}
            {step === 7 && (
              <>
                <StepTitle>7️⃣ Pernyataan & Referensi</StepTitle>
                <Textarea
                  label="Mengapa ingin bergabung di Sekolah Kristen Yahya?"
                  name="alasan_bergabung"
                  value={form.alasan_bergabung}
                  onChange={handleChange}
                />
                <Textarea
                  label="Referensi yang Dapat Dihubungi"
                  name="referensi"
                  value={form.referensi}
                  onChange={handleChange}
                  placeholder="Nama (Profesi) - Nomor Telepon"
                />
              </>
            )}

            <NextPrevButtons
              step={step}
              total={steps.length}
              nextStep={nextStep}
              prevStep={prevStep}
              loading={loading}
            />
          </motion.div>
        </AnimatePresence>
      </form>
    </main>
  );
}

/* 🧱 Komponen kecil */
const StepTitle = ({ children }) => (
  <h2 className="text-xl font-semibold mb-4">{children}</h2>
);

function Input({ label, ...props }) {
  return (
    <div className="mb-3">
      <label className="block mb-1 font-medium">{label}</label>
      <input
        {...props}
        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div className="mb-3">
      <label className="block mb-1 font-medium">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
      >
        <option value="">-- Pilih --</option>
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="mb-3">
      <label className="block mb-1 font-medium">{label}</label>
      <textarea
        {...props}
        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
        rows="4"
      />
    </div>
  );
}

function FileInput({ label, onChange }) {
  return (
    <div className="mb-3">
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type="file"
        accept="application/pdf"
        onChange={onChange}
        className="w-full border p-2 rounded-lg"
      />
    </div>
  );
}

function NextPrevButtons({ step, total, nextStep, prevStep, loading }) {
  return (
    <div className="flex justify-between mt-8">
      {step > 1 ? (
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-300 px-4 py-2 rounded-lg"
        >
          ← Kembali
        </button>
      ) : (
        <div />
      )}
      {step < total ? (
        <button
          type="button"
          onClick={nextStep}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Selanjutnya →
        </button>
      ) : (
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          {loading ? "Mengirim..." : "Kirim Lamaran"}
        </button>
      )}
    </div>
  );
}
