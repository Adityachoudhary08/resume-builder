"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Download, Sparkles } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface AtsResult {
  atsScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

interface Resume {
  title: string;
  summary: string;

  personalInfo: {
    fullname: string;
    email: string;
    mobile: string;
    location: string;
    github: string;
    portfolio: string;
  };

  education: {
    institute: string;
    degree: string;
    startDate: string;
    endDate: string;
  }[];

  skills: string[];

  projects: {
    title: string;
    description: string;
    techStack: string[];
    githubUrl: string;
    liveUrl: string;
  }[];

  workExperience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];

  certifications: string[];
}

export default function ResumePreviewPage() {
  const [resume, setResume] = useState<Resume | null>(null);

  const [loading, setLoading] = useState(true);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsResult, setAtsResult] = useState<AtsResult | null>(null);
  const [atsError, setAtsError] = useState<string | null>(null);

  const { resumeId } = useParams();
  const router = useRouter();

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const { data } = await axios.get(`/api/resume/${resumeId}`);

      console.log("main resume in data", data);

      setResume(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAtsScore = async () => {
    if (!resume) return;

    try {
      setAtsLoading(true);
      setAtsError(null);

      const resumeText = [
        resume.personalInfo?.fullname,
        resume.personalInfo?.email,
        resume.personalInfo?.mobile,
        resume.personalInfo?.location,
        resume.summary,
        resume.skills?.join(", "),
        resume.workExperience?.map((experience) =>
          `${experience.position} at ${experience.company}: ${experience.description}`
        ).join("\n"),
        resume.projects?.map((project) =>
          `${project.title}: ${project.description}. ${project.techStack?.join(", ")}`
        ).join("\n"),
        resume.education?.map((education) =>
          `${education.degree} - ${education.institute}`
        ).join("\n"),
        resume.certifications?.join(", "),
      ].filter(Boolean).join("\n");

      const { data } = await axios.post("/api/ai/ats-score", {
        ResumeText: resumeText,
      });

      const generatedResult = data.data.atsScore;
      setAtsResult(
        typeof generatedResult === "string"
          ? JSON.parse(generatedResult)
          : generatedResult
      );
    } catch (error) {
      console.log(error);
      setAtsError("Unable to generate the ATS score right now.");
    } finally {
      setAtsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-300">
        Loading Resume...
      </div>
    );
  }

  if (!resume) return null;

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Actions */}

          <div className="lg:col-span-1">
            <div className="preview-actions sticky top-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100">
              <h2 className="mb-6 text-xl font-semibold">Resume actions</h2>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleAtsScore}
                  disabled={atsLoading}
                  className="flex w-full items-center gap-3 rounded-lg bg-zinc-100 px-4 py-3 text-zinc-950 transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-60"
                >
                  <Sparkles size={18} />
                  {atsLoading ? "Analyzing..." : "ATS Score"}
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex w-full items-center gap-3 rounded-lg border border-zinc-700 px-4 py-3 text-zinc-300 transition-colors hover:bg-zinc-800"
                >
                  <Download size={18} />
                  Download PDF
                </button>

                <button
                  type="button"
                  onClick={() => router.push(`/resume/${resumeId}`)}
                  className="flex w-full items-center gap-3 rounded-lg border border-zinc-700 px-4 py-3 text-zinc-300 transition-colors hover:bg-zinc-800"
                >
                  <Eye size={18} />
                  Edit Resume
                </button>
              </div>

              {atsError && <p className="mt-4 text-sm text-red-300">{atsError}</p>}

              {atsResult && (
                <div className="mt-6 border-t border-zinc-800 pt-5 text-sm">
                  <div className="flex items-end justify-between">
                    <span className="text-zinc-400">ATS score</span>
                    <span className="text-3xl font-semibold text-zinc-100">{atsResult.atsScore}/100</span>
                  </div>
                  <p className="mt-3 leading-6 text-zinc-400">{atsResult.summary}</p>
                </div>
              )}
            </div>
          </div>

          {/* Resume */}

          <div className="lg:col-span-3">
            <div
              id="resume-preview"
              className="resume-preview rounded-lg bg-white p-10 text-zinc-900 shadow-lg"
            >
              {/* Header */}

              <div className="border-b pb-6">
                <h1 className="text-4xl font-bold text-zinc-900">
                  {resume.personalInfo?.fullname}
                </h1>

                <div className="mt-3 text-gray-600 text-sm flex flex-wrap gap-4">
                  <span>{resume.personalInfo?.email}</span>

                  <span>{resume.personalInfo?.mobile}</span>

                  <span>{resume.personalInfo?.location}</span>
                </div>

                <div className="mt-2 flex gap-4 text-sm text-zinc-600">
                  <span>{resume.personalInfo?.github}</span>

                  <span>{resume.personalInfo?.portfolio}</span>
                </div>
              </div>

              {/* Summary */}

              {resume.summary && (
                <section className="mt-8">
                    <h2 className="mb-3 text-xl font-bold text-zinc-900">
                    Professional Summary
                  </h2>

                  <p className="text-gray-700 leading-7">{resume.summary}</p>
                </section>
              )}

              {/* Skills */}

              <section className="mt-8">
                    <h2 className="mb-3 text-xl font-bold text-zinc-900">Skills</h2>

                <div className="flex flex-wrap gap-2">
                  {resume.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="bg-slate-100 px-3 py-1 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Experience */}

              <section className="mt-8">
                <h2 className="mb-4 text-xl font-bold text-zinc-900">Work Experience</h2>

                {resume.workExperience?.map((exp, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="font-semibold text-zinc-900">{exp.position}</h3>

                    <p className="text-gray-500 text-sm">{exp.company}</p>

                    <p className="text-sm text-gray-500">
                      {exp.startDate}
                      {" - "}
                      {exp.endDate}
                    </p>

                    <p className="mt-2 text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </section>

              {/* Projects */}

              <section className="mt-8">
                <h2 className="mb-4 text-xl font-bold text-zinc-900">Projects</h2>

                {resume.projects?.map((project, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="font-semibold text-zinc-900">{project.title}</h3>

                    <p className="mt-2 text-gray-700">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.techStack?.map((tech) => (
                        <span
                          key={tech}
                          className="rounded bg-zinc-100 px-2 py-1 text-zinc-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </section>

              {/* Education */}

              <section className="mt-8">
                <h2 className="mb-4 text-xl font-bold text-zinc-900">Education</h2>

                {resume.education?.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-semibold text-zinc-900">{edu.degree}</h3>

                    <p className="text-gray-600">{edu.institute}</p>

                    <p className="text-sm text-gray-500">
                      {edu.startDate}
                      {" - "}
                      {edu.endDate}
                    </p>
                  </div>
                ))}
              </section>

              {/* Certifications */}

              {resume.certifications?.length > 0 && (
                <section className="mt-8">
                  <h2 className="mb-4 text-xl font-bold text-zinc-900">Certifications</h2>

                  <ul className="list-disc pl-5">
                    {resume.certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}