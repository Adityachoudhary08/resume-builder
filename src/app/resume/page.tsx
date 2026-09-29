"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Plus, FileText, Trash2, Briefcase, Pencil } from "lucide-react";

import {
  createResumeApi,
  deleteResumeApi,
  getAllResumesApi,
} from "@/apis/resume.api";

interface Resume {
  _id: string;
  title: string;
  jobTitle: string;
  experienceLevel: string;
}

export default function ResumePage() {
  const router = useRouter();

  const [resumes, setResumes] = useState<Resume[]>([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    jobTitle: "",
    experienceLevel: "Fresher",
  });

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const data = await getAllResumesApi();

      setResumes(data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResume = async () => {
    try {
      const response = await createResumeApi({
        title: formData.title,
        jobTitle: formData.jobTitle,
        experienceLevel: formData.experienceLevel,
      });

      console.log(response);

      const resumeId = response.data._id;
      console.log("reached...");

      router.push(`/resume/${resumeId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (resumeId: string) => {
    try {
      await deleteResumeApi(resumeId);

      setResumes((currentResumes) =>
        currentResumes.filter((resume) => resume._id !== resumeId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-semibold text-zinc-100">My Resumes</h1>

            <p className="mt-2 text-zinc-400">
              Create ATS-friendly resumes using AI.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-zinc-100 px-5 py-3 font-medium text-zinc-950 transition-colors hover:bg-white"
          >
            <Plus size={18} />
            Create Resume
          </button>
        </div>

        {/* Empty State */}

        {!loading && resumes.length === 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-16 text-center shadow-xl">
            <FileText size={56} className="mx-auto text-zinc-600" />

            <h2 className="mt-6 text-2xl font-semibold text-zinc-100">No resumes yet</h2>

            <p className="mt-2 text-zinc-400">
              Create your first AI powered resume.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="mt-6 rounded-lg bg-zinc-100 px-5 py-3 font-medium text-zinc-950 transition-colors hover:bg-white"
            >
              Create Resume
            </button>
          </div>
        )}

        {/* Resume Grid */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
              <div
              key={resume._id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg transition-all hover:border-zinc-600"
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-100">{resume.title}</h2>

                  <div className="mt-2 flex items-center gap-2 text-zinc-400">
                    <Briefcase size={16} />
                    {resume.jobTitle}
                  </div>

                  <span className="inline-block mt-4 bg-pink-200 text-pink-950 font-medium px-3 py-1 rounded-full text-sm">
                    {resume.experienceLevel}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(resume._id)}
                  aria-label={`Delete ${resume.title || "resume"}`}
                  title="Delete resume"
                  className="text-zinc-500 transition-colors hover:text-red-400"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => router.push(`/resume/${resume._id}`)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-100 py-3 font-medium text-zinc-950 transition-colors hover:bg-white"
                >
                  <Pencil size={16} />
                  Edit resume
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/resume/${resume._id}/preview`)}
                  className="rounded-lg border border-zinc-700 px-4 py-3 text-zinc-300 transition-colors hover:bg-zinc-800"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
            <h2 className="mb-6 text-2xl font-semibold text-zinc-100">Create resume</h2>

            <div className="space-y-4">
              <input
                placeholder="Resume Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />

              <input
                placeholder="Job Title"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jobTitle: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />

              <select
                value={formData.experienceLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experienceLevel: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-zinc-200 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              >
                <option>Fresher</option>

                <option>Junior</option>

                <option>Mid-Level</option>

                <option>Senior</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-zinc-700 px-5 py-3 text-zinc-300 transition-colors hover:bg-zinc-800"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateResume}
                className="rounded-lg bg-zinc-100 px-5 py-3 font-medium text-zinc-950 transition-colors hover:bg-white"
              >
                Create Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}