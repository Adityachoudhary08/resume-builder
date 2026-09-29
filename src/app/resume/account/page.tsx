"use client";

import axios from "axios";
import Link from "next/link";
import { Camera, LogOut, UserRound } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface StoredUser {
  name?: string;
  email?: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser>({});
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = window.localStorage.getItem("resume-builder-user");
    const storedImage = window.localStorage.getItem("resume-builder-profile-image");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedImage) setProfileImage(storedImage);
  }, []);

  const handleProfileImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const image = String(reader.result);
      setProfileImage(image);
      window.localStorage.setItem("resume-builder-profile-image", image);
      window.dispatchEvent(new Event("resume-builder-profile-updated"));
    };
    reader.readAsDataURL(file);
  };

  const handleSignOut = async () => {
    await axios.post("/api/auth/logout");
    window.localStorage.removeItem("resume-builder-user");
    router.push("/auth/login");
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-zinc-100">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <div className="flex flex-col gap-6 border-b border-zinc-800 pb-8 sm:flex-row sm:items-center">
          <label className="group relative flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-zinc-800 text-zinc-400">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <UserRound size={30} />
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <Camera size={20} />
            </span>
            <input type="file" accept="image/*" onChange={handleProfileImage} className="sr-only" />
          </label>
          <div>
            <h1 className="text-2xl font-semibold">{user.name || "Your account"}</h1>
            <p className="mt-1 text-sm text-zinc-400">{user.email || "Profile details"}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-8">
          <Link href="/resume" className="rounded-lg bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white">
            View my resumes
          </Link>
          <button type="button" onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
}