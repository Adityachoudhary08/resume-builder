import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ApiResponse } from "@/types/api.types";
import resumeModel from "@/models/resume.models";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const userId = await getCurrentUser();
        if (!userId) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Unauthorized"
            }, { status: 401 });
        }

        const resumes = await resumeModel.find({ user_id: userId }).sort({ updatedAt: -1 });

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Resumes fetched successfully",
            data: resumes
        }, { status: 200 });
    } catch (error) {
        console.error("error in get all resumes api:", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Something went wrong"
        }, { status: 500 });
    }
}
