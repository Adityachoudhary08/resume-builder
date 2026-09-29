import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectDB } from "@/lib/mongodb";
import ResumeModel from "@/models/resume.models";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, {params}:{params: Promise<{resumeId: string}>}) {
    try {
        await connectDB()
        const userId = await getCurrentUser()
        if (!userId) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Unauthorized"
            }, { status: 401 })
        }
        const { resumeId } = await params
        const resume = await ResumeModel.findOne({
            _id: resumeId,
            user_id: userId,
        })
        if (!resume) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Resume not found"
            }, { status: 404 })
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Resume fetched successfully",
            data: resume
        }, { status: 200 })

    } catch (error) {
        console.error("error in get resume API:", error)
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Something went wrong"
        }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, {params}:{params: Promise<{resumeId: string}>}) {
    try {
        await connectDB()
        const userId = await getCurrentUser()
        if (!userId) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Unauthorized"
            }, { status: 401 })
        }
        const body = await req.json()
        
        const { resumeId } = await params
        const updatedResume = await ResumeModel.findOneAndUpdate({
            _id: resumeId,
            user_id: userId,
        }, {
            $set: body
        }, {
            new: true,
            runValidators: true
        })

        if (!updatedResume) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Failed to update resume"
            }, { status: 400 })
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Resume updated successfully",
            data: updatedResume
        }, { status: 200 })

    } catch (error) {
        console.error("error in update resume API:", error)
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Something went wrong"
        }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
    try {
        await connectDB()
        const userId = await getCurrentUser()
        if (!userId) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Unauthorized"
            }, { status: 401 })
        }

        const { resumeId } = await params
        const deletedResume = await ResumeModel.findOneAndDelete({
            _id: resumeId,
            user_id: userId,
        })

        if (!deletedResume) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Resume not found"
            }, { status: 404 })
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Resume deleted successfully",
            data: deletedResume
        }, { status: 200 })
    } catch (error) {
        console.error("error in delete resume API:", error)
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Something went wrong"
        }, { status: 500 })
    }
}


