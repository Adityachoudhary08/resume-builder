"use client";

import Link from "next/link";
import { FileText, Home, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

interface ResumeNavbarProps {
  showSignIn?: boolean;
}

interface StoredUser {
  name?: string;
}

export default function ResumeNavbar({ showSignIn = false }: ResumeNavbarProps) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = () => {
      const storedUser = window.localStorage.getItem("resume-builder-user");
      const storedImage = window.localStorage.getItem("resume-builder-profile-image");

      setUser(storedUser ? JSON.parse(storedUser) : null);
      setProfileImage(storedImage);
    };

    loadProfile();
    window.addEventListener("resume-builder-profile-updated", loadProfile);

    return () => {
      window.removeEventListener("resume-builder-profile-updated", loadProfile);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40">
      <div className="relative flex min-h-16 items-center justify-center px-4">
        <nav className="nav-glass flex w-fit max-w-[calc(100%-2rem)] items-center justify-center gap-3 px-4 py-2 sm:gap-6 sm:px-5">
          <Link href="/" className="nav-link">
            <Home size={16} />
            <span>Home</span>
          </Link>
          <Link href="/resume" className="nav-link">
            <FileText size={16} />
            <span>My Resumes</span>
          </Link>
          <Link href="/resume/account" className="nav-link">
            {profileImage ? (
              <img src={profileImage} alt="" className="h-6 w-6 rounded-full object-cover" />
            ) : (
              <UserRound size={16} />
            )}
            <span>{user?.name || "Account"}</span>
          </Link>
        </nav>

        <div className="absolute right-4 flex items-center gap-3 sm:right-6 sm:gap-5">
          {showSignIn && !user && (
            <Link href="/auth/login" className="sign-in-link">
              Sign in
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
