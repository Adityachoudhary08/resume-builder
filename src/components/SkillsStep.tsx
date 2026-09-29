"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, X } from "lucide-react";

interface Props {
  resumeId: string;
  onNext: () => void;
  onBack: () => void;
}

export default function SkillsStep({ resumeId, onNext, onBack }: Props) {
  console.log("kya yaha pr hai--------->", resumeId);
  const [skills, setSkills] = useState<string[]>([]);
  console.log("skilsss ->", skills);
  const [skillInput, setSkillInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const { data } = await axios.get(`/api/resume/${resumeId}/`);

      setSkills(data.resume.skills || []);
    } catch (error) {
      console.log(error);
    }
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;

    setSkills((prev) => [...prev, skillInput.trim()]);

    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((item) => item !== skill));
  };

  const generateSkills = async () => {
    try {
      setAiLoading(true);
      console.log("heyy.....");

      const { data: resumeData } = await axios.get(`/api/resume/${resumeId}`);

      console.log("data in resume find", resumeData);

      const resume = resumeData.resume;

      const { data } = await axios.post("/api/ai/generate-skills", {
        jobTitle: "web developer",
        experienceLevel: "mid-level",
      });

      console.log("bhai ai ne response diya ", data);

      setSkills(data.data.skills);
    } catch (error) {
      console.log(error);
    } finally {
      setAiLoading(false);
    }
  };

  const saveSkills = async () => {
    try {
      setLoading(true);

      await axios.patch(`/api/resume/${resumeId}`, {
        skills,
      });

      onNext();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 text-slate-200">
      <div className="max-w-5xl mx-auto">
        {/* Progress */}

        <div className="mb-8">
          <div className="flex justify-between mb-2 text-slate-400">
            <span>Step 3 of 8</span>

            <span>37%</span>
          </div>

          <div className="h-2 bg-slate-800 rounded-full">
            <div className="h-full w-[37%] bg-violet-400 rounded-full" />
          </div>
        </div>

        {/* Card */}

        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-100">Skills</h1>

              <p className="text-slate-400 mt-2">
                Add skills relevant to your role.
              </p>
            </div>

            <button
              onClick={generateSkills}
              disabled={aiLoading}
              className="flex items-center gap-2 px-5 py-3 bg-violet-300 text-violet-950 font-medium rounded-xl hover:bg-violet-200 transition-colors"
            >
              <Sparkles size={18} />

              {aiLoading ? "Generating..." : "Generate with AI"}
            </button>
          </div>

          {/* Input */}

          <div className="flex gap-3">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Enter skill"
              className="flex-1 border border-slate-700 bg-slate-950 text-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-500 focus:outline-none focus:border-violet-400 transition-colors"
            />

            <button
              onClick={addSkill}
              type="button"
              className="px-5 py-3 bg-teal-300 text-teal-950 font-medium rounded-xl hover:bg-teal-200 transition-colors"
            >
              Add
            </button>
          </div>

          {/* Skills */}

          <div className="flex flex-wrap gap-3 mt-8">
            {Array.isArray(skills) && skills.map((skill) => (
              <div
                key={skill}
                className="flex items-center gap-2 bg-pink-200 text-pink-950 font-medium px-4 py-2 rounded-full shadow-sm"
              >
                {skill}

                <button onClick={() => removeSkill(skill)}>
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}

          <div className="flex justify-between mt-12">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-5 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              onClick={saveSkills}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-violet-300 hover:bg-violet-200 text-violet-950 font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Continue"}

              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}