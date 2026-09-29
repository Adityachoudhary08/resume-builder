"use client";

import axios from "axios";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import { ArrowLeft, ArrowRight, Plus, Trash2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  resumeId: string;
  onNext: () => void;
  onBack: () => void;
}

interface ExperienceItem {
  company: string;
  role: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
}

interface FormValues {
  experience: ExperienceItem[];
}

export default function ExperienceStep({ resumeId, onNext, onBack }: Props) {
  let router = useRouter();

  const {
    register,
    control,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      experience: [
        {
          company: "",
          role: "",
          employmentType: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          description: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const { data } = await axios.get(`/api/resume/${resumeId}`);

      if (data.resume.experience?.length) {
        reset({
          experience: data.resume.experience,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const generateDescription = async (index: number) => {
    try {
      const exp = watch(`experience.${index}`);

      const { data: resumeData } = await axios.get(`/api/resume/${resumeId}`);

      const resume = resumeData.resume;

      const { data } = await axios.post("/api/ai/generate-experience", {
        jobRole: exp.role,
        experienceLevel: resume.experienceLevel,
      });

      setValue(`experience.${index}.description`, data.description);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      await axios.patch(`/api/resume/${resumeId}`, {
        experience: values.experience,
      });

      router.push(`/resume/${resumeId}/preview`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 text-slate-200">
      <div className="max-w-6xl mx-auto">
        {/* Progress */}

        <div className="mb-8">
          <div className="flex justify-between text-slate-400">
            <span>Step 5 of 8</span>

            <span>62%</span>
          </div>

          <div className="h-2 bg-slate-800 rounded-full mt-2">
            <div className="h-full w-[62%] bg-violet-400 rounded-full" />
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-100">Work Experience</h1>

              <p className="text-slate-400 mt-2">
                Showcase your professional experience.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                append({
                  company: "",
                  role: "",
                  employmentType: "",
                  startDate: "",
                  endDate: "",
                  currentlyWorking: false,
                  description: "",
                })
              }
              className="bg-teal-300 text-teal-950 font-medium px-4 py-3 rounded-xl flex items-center gap-2 hover:bg-teal-200 transition-colors"
            >
              <Plus size={18} />
              Add Experience
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-slate-700 bg-slate-900 rounded-2xl p-6 relative">
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-4 right-4 text-red-500"
                  >
                    <Trash2 />
                  </button>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    {...register(`experience.${index}.company`)}
                    placeholder="Company Name"
                    className="bg-slate-950 text-slate-200 border border-slate-700 rounded-xl p-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-colors"
                  />

                  <input
                    {...register(`experience.${index}.role`)}
                    placeholder="Job Title"
                    className="bg-slate-950 text-slate-200 border border-slate-700 rounded-xl p-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-colors"
                  />

                  <select
                    {...register(`experience.${index}.employmentType`)}
                    className="bg-slate-950 text-slate-200 border border-slate-700 rounded-xl p-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-colors"
                  >
                    <option value="">Employment Type</option>
                    <option>Full Time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                    <option>Freelance</option>
                  </select>

                  <input
                    type="date"
                    {...register(`experience.${index}.startDate`)}
                    className="bg-slate-950 text-slate-200 border border-slate-700 rounded-xl p-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-colors"
                  />

                  <input
                    type="date"
                    {...register(`experience.${index}.endDate`)}
                    disabled={watch(`experience.${index}.currentlyWorking`)}
                    className="bg-slate-950 text-slate-200 border border-slate-700 rounded-xl p-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="mt-4 text-slate-300">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      {...register(`experience.${index}.currentlyWorking`)}
                    />
                    Currently Working Here
                  </label>
                </div>

                <div className="mt-6">
                  <div className="flex justify-end mb-3">
                    <button
                      type="button"
                      onClick={() => generateDescription(index)}
                      className="bg-pink-200 text-pink-950 font-medium px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-pink-100 transition-colors"
                    >
                      <Sparkles size={18} />
                      Generate Description
                    </button>
                  </div>

                  <textarea
                    rows={6}
                    {...register(`experience.${index}.description`)}
                    placeholder="Describe your responsibilities and achievements..."
                    className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl p-4 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={onBack}
                className="border border-slate-700 text-slate-300 hover:bg-slate-800 px-5 py-3 rounded-xl flex items-center gap-2 transition-colors"
              >
                <ArrowLeft size={18} />
                Back
              </button>

              <button
                disabled={isSubmitting}
                className="bg-violet-300 text-violet-950 hover:bg-violet-200 font-medium px-6 py-3 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Continue"}

                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}