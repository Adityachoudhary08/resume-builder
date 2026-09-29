"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { registerApi } from "@/apis/auth.api";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterFormData>();

  const onSubmit = async (
    data: RegisterFormData
  ) => {
    try {
      const response = await registerApi(data);
      window.localStorage.setItem(
        "resume-builder-user",
        JSON.stringify(response.data?.user)
      );

      router.push("/resume");
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {/* Left Section */}
      <div className="hidden flex-1 flex-col justify-between border-r border-zinc-800 bg-zinc-900 p-12 text-white lg:flex">
        <div>
          <h1 className="text-4xl font-bold">
            AI Resume Builder
          </h1>

          <p className="mt-4 text-zinc-400">
            Create ATS-optimized resumes with AI.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-bold">
            Build Your Professional Resume
          </h2>

          <p className="mt-4 text-zinc-400">
            Generate summaries, skills,
            experiences and ATS reports instantly.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
          <h2 className="text-3xl font-semibold text-zinc-100">
            Create account
          </h2>

          <p className="mt-2 text-zinc-400">
            Start building your resume.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-5"
          >
            <div>
              <label className="block mb-2 text-sm font-medium">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  {...register("name", {
                    required: "Name is required",
                  })}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-3 pl-11 pr-4 text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  {...register("email", {
                    required: "Email is required",
                  })}
                  placeholder="john@example.com"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-3 pl-11 pr-4 text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message:
                        "Minimum 6 characters required",
                    },
                  })}
                  placeholder="********"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-3 pl-11 pr-4 text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-100 py-3 font-semibold text-zinc-950 transition-colors hover:bg-white"
            >
              {isSubmitting
                ? "Creating Account..."
                : "Create Account"}

              <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-6 text-center text-zinc-500">
            Already have an account?
            <Link
              href="/auth/login"
              className="ml-2 font-semibold text-zinc-200 hover:text-white"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}