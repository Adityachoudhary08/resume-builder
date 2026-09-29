

import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import {  ImproveContentBody } from "@/types/ai.types";
import { generateAiContent } from "@/lib/gemini";

export async function POST(req: NextRequest) {
     try {

          const body: ImproveContentBody = await req.json()
          const { content } = body

          if (!content) {
               return NextResponse.json<ApiResponse>({
                    success: false,
                    message: "Missing required fields"
               }, { status: 400 })
          }


          const prompt = `
         You are an expert ATS (Applicant Tracking System) resume writer, career coach, and technical recruiter.

Your task is to improve the provided resume content while preserving its original meaning and factual accuracy.

Input:

Resume Content:
${content}

Rules:

1. Improve ONLY the provided resume content.
2. Do NOT add headings, titles, bullet points, markdown, quotation marks, or special formatting.
3. Keep the improved content between 10% and 20% longer than the original only if it improves clarity; otherwise, maintain a similar length.
4. Rewrite the content to be professional, concise, grammatically correct, and ATS-friendly.
5. Preserve all factual information from the original content.
6. Do NOT invent companies, projects, technologies, certifications, years of experience, metrics, achievements, responsibilities, or qualifications.
7. Naturally incorporate relevant ATS keywords only if they are already implied by the original content.
8. Replace weak or repetitive wording with strong, action-oriented language where appropriate.
9. Improve readability, sentence structure, and overall impact while maintaining a natural flow.
10. Remove unnecessary filler words, redundancy, spelling mistakes, and grammatical errors.
11. Do NOT change the intent or introduce new information.
12. Avoid first-person pronouns (I, me, my).
13. Return plain text only.
14. Ensure the final output is suitable for direct placement into a modern ATS-compatible resume.

Output:

Return ONLY the improved resume content as plain text.
        `;
        const result = await generateAiContent(prompt);
 
        const improvedContent = result;

        return NextResponse.json<ApiResponse>({
             success: true,
             message: "Content improved successfully",
             data: { improvedContent }
        }, { status: 201 })





     } catch (error) {

          console.log("error in generate content api:", error)
          return NextResponse.json<ApiResponse>({
               success: false,
               message: "Something went wrong "
          }, { status: 500 })
     }
}