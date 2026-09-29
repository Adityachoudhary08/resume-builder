import { redirect } from "next/navigation";

export default async function PersonalInfoPage({
	params,
}: {
	params: Promise<{ resumeId: string }>;
}) {
	const { resumeId } = await params;

	redirect(`/resume/${resumeId}`);
}
