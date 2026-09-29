"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { loginApi } from "@/apis/auth.api";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (
    data: LoginFormData
  ) => {
    try {
      setErrorMessage(null);
      const response = await loginApi(data);
      window.localStorage.setItem(
        "resume-builder-user",
        JSON.stringify(response.data?.user)
      );
      router.push("/resume");
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Login failed. Please try again.";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {/* Left */}
      <div className="hidden flex-1 flex-col justify-between border-r border-zinc-800 bg-zinc-900 p-12 text-white lg:flex">
        <div>
          <h1 className="text-4xl font-bold">
            AI Resume Builder
          </h1>

          <p className="mt-4 text-zinc-400">
            Build professional resumes powered by AI.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-bold">
            Welcome Back
          </h2>

          <p className="mt-4 text-zinc-400">
            Continue building your ATS-friendly
            resume.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
          <h2 className="text-3xl font-semibold text-zinc-100">
            Sign in
          </h2>

          <p className="mt-2 text-zinc-400">
            Access your resume dashboard.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-5"
          >
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

            {errorMessage && (
              <div className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
                {errorMessage}
              </div>
            )}

            <button
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-100 py-3 font-semibold text-zinc-950 transition-colors hover:bg-white"
            >
              {isSubmitting
                ? "Logging In..."
                : "Login"}

              <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-6 text-center text-zinc-500">
            Don't have an account?
            <Link
              href="/auth/register"
              className="ml-2 font-semibold text-zinc-200 hover:text-white"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}