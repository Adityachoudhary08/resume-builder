"use client";

import { useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { User, Mail, Phone, MapPin, Globe, ArrowRight } from "lucide-react";

interface Props {
  resumeId: string | null;
  onNext: () => void;
}

interface PersonalInfoForm {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export default function PersonalInfoStep({ resumeId, onNext }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PersonalInfoForm>();

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const { data } = await axios.get(`/api/resume/${resumeId}`);

      reset(data.resume.personalInfo || {});
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (values: PersonalInfoForm) => {
    try {
      await axios.patch(`/api/resume/${resumeId}`, {
        personalInfo: values,
      });

      onNext();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 text-slate-200">
      <div className="max-w-4xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-slate-400">
            <span className="font-medium">Step 1 of 8</span>

            <span>12%</span>
          </div>

          <div className="h-2 bg-slate-800 rounded-full">
            <div className="h-full w-[12%] bg-violet-400 rounded-full" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-100">
              Personal Information
            </h1>

            <p className="text-slate-400 mt-2">
              Tell recruiters how they can reach you.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <InputField
              icon={<User size={18} />}
              placeholder="John Doe"
              label="Full Name"
              register={register("fullName")}
            />

            {/* Email */}
            <InputField
              icon={<Mail size={18} />}
              placeholder="john@example.com"
              label="Email"
              register={register("email")}
            />

            {/* Phone */}
            <InputField
              icon={<Phone size={18} />}
              placeholder="+91 9876543210"
              label="Phone Number"
              register={register("phone")}
            />

            {/* Location */}
            <InputField
              icon={<MapPin size={18} />}
              placeholder="Bhopal, India"
              label="Location"
              register={register("location")}
            />

            {/* LinkedIn */}
            <InputField
              //   icon={<Linkedin size={18} />}
              placeholder="https://linkedin.com/in/..."
              label="LinkedIn"
              register={register("linkedin")}
            />

            {/* Github */}
            <InputField
              //   icon={<Github size={18} />}
              placeholder="https://github.com/..."
              label="GitHub"
              register={register("github")}
            />

            {/* Portfolio */}
            <InputField
              icon={<Globe size={18} />}
              placeholder="https://portfolio.com"
              label="Portfolio"
              register={register("portfolio")}
            />

            <div className="flex justify-end pt-4">
              <button
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 bg-violet-300 hover:bg-violet-200 text-violet-950 px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
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

function InputField({ label, placeholder, icon, register }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </div>

        <input
          {...register}
          placeholder={placeholder}
          className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl py-3 pl-12 pr-4 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-colors"
        />
      </div>
    </div>
  );
}