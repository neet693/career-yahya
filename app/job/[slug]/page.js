import supabase from "@/lib/supabaseClient";

export default async function JobDetail({ params }) {
  const { slug } = await params;

  // Ambil data job berdasarkan slug
  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !job) {
    return <div className="p-6 text-red-500">Lowongan tidak ditemukan.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {job.image_url && (
        <img
          src={job.image_url}
          alt={job.title}
          className="rounded-2xl w-full mb-6"
        />
      )}
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <p className="text-gray-700 mb-6">{job.description}</p>
      <h2 className="font-semibold mb-2">Persyaratan:</h2>
      <p className="text-gray-600 whitespace-pre-line">{job.requirements}</p>

      <div className="text-center">
        <a
          href={`/job/${job.slug}/apply`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
        >
          Lamar Sekarang
        </a>
      </div>
    </div>
  );
}
