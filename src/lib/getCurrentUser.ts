import { cookies } from "next/headers"
import { verifyToken } from "./jwt"

export async function getCurrentUser() {
    try {
        let cookieStore = await cookies()

        let token = cookieStore.get("token")?.value
        if (!token) throw new Error("No token found")

        const decode = verifyToken(token)
        if (!decode) throw new Error("Invalid token")

        return decode.userId

    } catch (error) {
        console.log("error in getCurrentUser:", error)
        return null
    }
}