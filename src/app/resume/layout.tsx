import ResumeNavbar from "@/components/ResumeNavbar";

export default function ResumeAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <ResumeNavbar />
      {children}
    </div>
  );
}