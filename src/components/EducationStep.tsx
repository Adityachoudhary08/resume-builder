"use client";

import axios from "axios";
import { useEffect } from "react";
import {
  useForm,
  useFieldArray,
} from "react-hook-form";

import {
  GraduationCap,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface Props {
  resumeId: string;
  onNext: () => void;
  onBack: () => void;
}

interface EducationForm {
  education: {
    institute: string;
    degree: string;
    startDate: string;
    endDate: string;
  }[];
}

export default function EducationStep({
  resumeId,
  onNext,
  onBack,
}: Props) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<EducationForm>({
    defaultValues: {
      education: [
        {
          institute: "",
          degree: "",
          startDate: "",
          endDate: "",
        },
      ],
    },
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "education",
  });

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const { data } = await axios.get(
        `/api/resume/${resumeId}`
      );

      if (
        data.resume?.education &&
        data.resume.education.length > 0
      ) {
        reset({
          education:
            data.resume.education,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (
    values: EducationForm
  ) => {
    try {
      await axios.patch(
        `/api/resume/${resumeId}`,
        {
          education:
            values.education,
        }
      );

      onNext();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 text-slate-200">
      <div className="max-w-5xl mx-auto">

        {/* Progress */}

        <div className="mb-8">
          <div className="flex justify-between mb-2 text-slate-400">
            <span className="font-medium">
              Step 2 of 8
            </span>

            <span>
              25%
            </span>
          </div>

          <div className="h-2 bg-slate-800 rounded-full">
            <div className="h-full w-[25%] bg-violet-400 rounded-full" />
          </div>
        </div>

        {/* Card */}

        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl p-8">

          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-xl bg-violet-300 flex items-center justify-center">
              <GraduationCap className="text-violet-950" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-100">
                Education
              </h1>

              <p className="text-slate-400 mt-2">
                Add your educational background.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(
              onSubmit
            )}
            className="space-y-6"
          >
            {fields.map(
              (field, index) => (
                <div
                  key={field.id}
                  className="border border-slate-700 bg-slate-900 rounded-2xl p-6 relative"
                >
                  {fields.length >
                    1 && (
                    <button
                      type="button"
                      onClick={() =>
                        remove(
                          index
                        )
                      }
                      className="absolute top-4 right-4 text-red-500 hover:text-red-600"
                    >
                      <Trash2
                        size={18}
                      />
                    </button>
                  )}

                  <div className="grid md:grid-cols-2 gap-5">

                    {/* Institute */}

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Institute
                      </label>

                      <input
                        {...register(
                          `education.${index}.institute`
                        )}
                        placeholder="Lakshmi Narain College of Technology"
                        className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl p-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-colors"
                      />
                    </div>

                    {/* Degree */}

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Degree
                      </label>

                      <input
                        {...register(
                          `education.${index}.degree`
                        )}
                        placeholder="B.Tech Computer Science"
                        className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl p-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-colors"
                      />
                    </div>

                    {/* Start Date */}

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Start Date
                      </label>

                      <input
                        type="date"
                        {...register(
                          `education.${index}.startDate`
                        )}
                        className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl p-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-colors"
                      />
                    </div>

                    {/* End Date */}

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        End Date
                      </label>

                      <input
                        type="date"
                        {...register(
                          `education.${index}.endDate`
                        )}
                        className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl p-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-colors"
                      />
                    </div>

                  </div>
                </div>
              )
            )}

            {/* Add Education */}

            <button
              type="button"
              onClick={() =>
                append({
                  institute: "",
                  degree: "",
                  startDate: "",
                  endDate: "",
                })
              }
              className="flex items-center gap-2 bg-teal-300 text-teal-950 font-medium px-5 py-3 rounded-xl hover:bg-teal-200 transition-colors"
            >
              <Plus size={18} />
              Add Education
            </button>

            <div className="flex justify-between pt-6">

              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 px-5 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft
                  size={18}
                />
                Back
              </button>

              <button
                type="submit"
                disabled={
                  isSubmitting
                }
                className="flex items-center gap-2 px-6 py-3 bg-violet-300 hover:bg-violet-200 text-violet-950 font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                {isSubmitting
                  ? "Saving..."
                  : "Continue"}

                <ArrowRight
                  size={18}
                />
              </button>

            </div>
          </form>

        </div>
      </div>
    </div>
  );
}