import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ApiResponse } from "@/types/api.types";
import resumeModel from "@/models/resume.models";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req: NextRequest) {
    try {
        await connectDB()

        const body = await req.json()

        const userId = await getCurrentUser()
        if (!userId) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Unauthorized"
            }, { status: 401 })
        }

        let newResume = await resumeModel.create({
            user_id: userId,
            title: body.title || "Untitled resume",
            jobTitle: body.jobTitle || "",
            experienceLevel: body.experienceLevel || "Fresher",
            summary: "",
            personalInfo: {},
            workExperience: [],
            projects: [],
            education: [],
            certifications: [],
            skills: [],
        })

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Resume created successfully",
            data: newResume
        }, { status: 201 })


    } catch (error) {
        console.error("error in create resume api:", error)
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Something went wrong"
        }, { status: 500 })
    }
}