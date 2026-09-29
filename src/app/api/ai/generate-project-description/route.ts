import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import { generateProjectDescriptionBody } from "@/types/ai.types";
import { generateAiContent } from "@/lib/gemini";

export async function POST(req: NextRequest) {
     try {

          const body: generateProjectDescriptionBody = await req.json()
          const { experienceLevel, techStack, jobTitle } = body

          if (!experienceLevel || !techStack || !jobTitle) {
               return NextResponse.json<ApiResponse>({
                    success: false,
                    message: "Missing required fields"
               }, { status: 400 })
          }


          const prompt = `
         You are an expert ATS resume writer and technical recruiter.

Your task is to generate ONLY a professional project description for a resume.

Input:

Job Title:
${jobTitle}

Experience Level:
${experienceLevel}

Technology Stack:
${techStack}

Rules:

1. Generate ONLY the project description.
2. The description must be between **40 and 70 words**.
3. Write in a professional, ATS-friendly tone suitable for a software engineering resume.
4. Tailor the description to the provided job title and experience level.
5. Naturally incorporate the provided technologies and relevant ATS keywords.
6. Describe a realistic software project that aligns with the given job title and tech stack.
7. Focus on the project's purpose, technical implementation, and development responsibilities.
8. Mention only the technologies provided in the input.
9. Do NOT invent measurable achievements, user counts, company names, certifications, awards, or business impact.
10. Do NOT mention technologies that are not included in the provided tech stack.
11. Use strong action verbs such as Developed, Designed, Implemented, Built, Integrated, Optimized, or Engineered.
12. Avoid first-person pronouns (I, me, my).
13. Do NOT use bullet points, markdown, headings, quotation marks, or special formatting.
14. Ensure the description is grammatically correct and ready to paste directly into an ATS-compatible resume.
15. Return plain text only.

Output:
Return ONLY the project description as plain text.
        `;
        const result = await generateAiContent(prompt);
 
        const projectDescription = result;

        return NextResponse.json<ApiResponse>({
             success: true,
             message: "Project description generated successfully",
             data: { projectDescription }
        }, { status: 201 })



     } catch (error) {

          console.log("error in generate project description api:", error)
          return NextResponse.json<ApiResponse>({
               success: false,
               message: "Something went wrong "
          }, { status: 500 })
     }
}
