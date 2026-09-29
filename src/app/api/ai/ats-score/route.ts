

import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import {  atsScoreBody } from "@/types/ai.types";
import { generateAiContent } from "@/lib/gemini";

export async function POST(req: NextRequest) {
     try {

          const body: atsScoreBody = await req.json()
          const { ResumeText } = body

          if (!ResumeText) {
               return NextResponse.json<ApiResponse>({
                    success: false,
                    message: "Missing required fields"
               }, { status: 400 })
          }


          const prompt = `
        You are an expert Applicant Tracking System (ATS) evaluator, professional resume writer, and technical recruiter.

Your task is to analyze the provided resume and return an ATS evaluation.

Input:

Resume:
${ResumeText}

Rules:

1. Analyze the resume as if it were being screened by a modern ATS and a recruiter.
2. Assign an overall ATS score between 0 and 100.
3. Consider the following factors:
   - Resume summary quality
   - Relevant keywords
   - Technical skills
   - Work experience
   - Projects
   - Education
   - Formatting consistency
   - Grammar and readability
   - Action-oriented language
   - ATS compatibility
4. Provide concise feedback for strengths and weaknesses.
5. Suggest actionable improvements that can increase the ATS score.
6. Do NOT invent information that is not present in the resume.
7. Base the evaluation only on the provided resume text.
8. Keep every feedback point concise (maximum 20 words).
9. Return ONLY valid JSON.
10. Do NOT wrap the JSON in markdown or code blocks.

Return exactly in this format:

{
  "atsScore": 85,
  "summary": "Well-structured resume with relevant technical skills and good ATS compatibility.",
  "strengths": [
    "Relevant technical skills included",
    "Projects align with target role",
    "Strong action-oriented language"
  ],
  "weaknesses": [
    "Resume summary is generic",
    "Few measurable achievements",
    "Limited role-specific keywords"
  ],
  "improvements": [
    "Add quantifiable achievements where applicable",
    "Include more role-specific ATS keywords",
    "Strengthen the professional summary"
  ]
}
        `;
        const result = await generateAiContent(prompt);
 
        const atsScore = result;

        return NextResponse.json<ApiResponse>({
             success: true,
             message: "ATS score generated successfully",
             data: { atsScore }
        }, { status: 201 })





     } catch (error) {

          console.log("error in generate ATS score api:", error)
          return NextResponse.json<ApiResponse>({
               success: false,
               message: "Something went wrong "
          }, { status: 500 })
     }
}