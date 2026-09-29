import { generateToken } from "@/lib/jwt"
import { connectDB } from "@/lib/mongodb"
import userModel from "@/models/user.model"
import { ApiResponse } from "@/types/api.types"
import { LoginBody } from "@/types/user.types"
import { NextRequest, NextResponse } from "next/server"


export async function POST(req: NextRequest) {
    try {
        await connectDB()

        let body: LoginBody = await req.json()
        let { email, password } = body
        if (!email || !password) {
            return NextResponse.json<ApiResponse>({ success: false, message: "Email and password are required" }, { status: 400 })
        }

        const normalizedEmail = email.trim().toLowerCase()
        let isExisted = await userModel.findOne({ email: normalizedEmail })

        if (!isExisted) {
            return NextResponse.json<ApiResponse>({ success: false, message: "User not found" }, { status: 404 })
        }

        let matchPass = isExisted.comparePassword(password)
        if (!matchPass) {
            return NextResponse.json<ApiResponse>({ success: false, message: "Invalid credentials" }, { status: 401 })
        }
          
        let token = generateToken({ userId: isExisted._id.toString() })

        let response = NextResponse.json<ApiResponse>({
            success: true,
            message: "User logged in successfully",
            data: {
                user: {
                    _id: isExisted._id,
                    name: isExisted.name,
                    email: isExisted.email
                }
            }
        }, { status: 200 })
        
        response.cookies.set("token", token, { 
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60, // 1 hour in seconds
            path: "/"
        })
        return response

    } catch (error) {
        console.error("error in login api:", error)
        return NextResponse.json<ApiResponse>({ success: false, message: "Something went wrong" }, { status: 500 })
    }
}