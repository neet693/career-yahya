import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { to, name } = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // true = port 465, false = 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"HRD Sekolah Kristen Yahya" <${process.env.SMTP_USER}>`,
      to,
      subject: "Terima Kasih Telah Melamar di Sekolah Yahya",
      html: `
        <p>Halo <b>${name}</b>,</p>
        <p>Terima kasih telah mengirim lamaran ke Sekolah Yahya.</p>
        <p>Berikut kami lampirkan formulir  dalam format Word untuk Anda isi dan bawa ketika di panggil oleh pihak kami.</p>
        <p>Salam hangat,<br>HRD Sekolah Kristen Yahya</p>
      `,
      attachments: [
        {
          filename: "Form_Lamaran_Offline.docx",
          path: process.env.NEXT_PUBLIC_FILE_WORD, // ambil dari env
        },
      ],
    });

    return Response.json({ success: true, message: "Email terkirim!" });
  } catch (error) {
    console.error("Gagal kirim email:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
