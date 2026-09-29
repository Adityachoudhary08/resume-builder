import { connectDB } from "@/lib/mongodb"
import { NextRequest, NextResponse } from "next/server"
import { ApiResponse } from "@/types/api.types"
import userModel from "@/models/user.model"
import { generateToken } from "@/lib/jwt"
import { RegisterBody } from "@/types/user.types"



export async function POST(req: NextRequest) {
    try {
        await connectDB()
        let body: RegisterBody = await req.json()
        let { name, email, password, mobile } = body
        if (!name || !email || !password) {
            return NextResponse.json<ApiResponse>({ success: false, message: "All fields are required" }, { status: 400 })
        }
        
        const normalizedEmail = email.trim().toLowerCase()
        let isExisted = await userModel.findOne({ email: normalizedEmail })

        if (isExisted) {
            return NextResponse.json<ApiResponse>({ success: false, message: "User already exists" }, { status: 409 })
        }

        let newUser = await userModel.create({ name: name.trim(), email: normalizedEmail, password, mobile })

        let token = generateToken({ userId: newUser._id.toString() })

        let response = NextResponse.json<ApiResponse>({
            success: true,
            message: "User registered successfully",
            data: {
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email
                }
            }
        }, { status: 201 })
        
        response.cookies.set("token", token, { 
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60, // 1 hour in seconds
            path: "/"
        })
        return response

    } catch (error) {
        console.error("error in register api:", error)
        return NextResponse.json<ApiResponse>({ success: false, message: "Something went wrong" }, { status: 500 })
    }
}