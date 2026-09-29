import Link from "next/link";
import ResumeNavbar from "@/components/ResumeNavbar";

function Page() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <ResumeNavbar showSignIn />

      <div className="mx-auto max-w-7xl px-6">
        <section className="grid min-h-[calc(100vh-4.5rem)] items-center gap-16 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div className="max-w-2xl">
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
              Professional resumes, simplified
            </p>
            <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-zinc-100 sm:text-7xl">
              Build a resume that gets read.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-zinc-400">
              Create a focused, ATS-friendly resume with a clear step-by-step workflow.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                href="/auth/register"
                className="inline-flex items-center rounded-lg bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white"
              >
                Create your resume
              </Link>
            </div>
          </div>

          <div className="border-y border-zinc-800 py-8 lg:border-y-0 lg:border-l lg:pl-12">
            <div className="mb-8 flex items-center justify-between text-sm text-zinc-500">
              <span>Resume workflow</span>
              <span>01 / 04</span>
            </div>
            <div className="space-y-0">
              {[
                ["01", "Personal information", "Your contact details"],
                ["02", "Experience and projects", "The work behind your story"],
                ["03", "Skills and education", "The details recruiters scan"],
                ["04", "Preview and share", "A resume ready to send"],
              ].map(([number, title, description]) => (
                <div key={number} className="flex gap-5 border-t border-zinc-800 py-5">
                  <span className="text-sm text-zinc-500">{number}</span>
                  <div>
                    <h2 className="font-medium text-zinc-100">{title}</h2>
                    <p className="mt-1 text-sm text-zinc-500">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-zinc-800 py-5 text-sm text-zinc-500">
          Keep your experience clear, concise, and ready to share.
        </footer>
      </div>
    </main>
  );
}

export default Page;