


import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import { generateExperienceDescriptionBody,  } from "@/types/ai.types";
import { generateAiContent } from "@/lib/gemini";

export async function POST(req: NextRequest) {
     try {

          const body: generateExperienceDescriptionBody = await req.json()
          const { experienceLevel, techStack, yearsOfExperience, jobRole } = body

          if (!experienceLevel || !techStack || !yearsOfExperience || !jobRole) {
               return NextResponse.json<ApiResponse>({
                    success: false,
                    message: "Missing required fields"
               }, { status: 400 })
          }


          const prompt = `
       You are an expert ATS resume writer and technical recruiter.

Your task is to generate ONLY a professional work experience description for a resume.

Input:

Job Role:
${jobRole}

Experience Level:
${experienceLevel}

Years of Experience:
${yearsOfExperience}

Technology Stack:
${techStack}

Rules:

1. Generate ONLY the work experience description.
2. The description must be between **60 and 100 words**.
3. Write in a professional, ATS-friendly tone suitable for a modern resume.
4. Tailor the description to the provided job role, experience level, years of experience, and technology stack.
5. Naturally incorporate the provided technologies and role-specific ATS keywords.
6. Focus on realistic day-to-day responsibilities, technical implementation, collaboration, debugging, testing, code quality, maintenance, and software development best practices.
7. Mention ONLY the technologies provided in the Technology Stack input.
8. Do NOT invent company names, products, certifications, awards, metrics, percentages, clients, or business outcomes.
9. Do NOT mention technologies that are not included in the input.
10. Use strong action verbs such as Developed, Designed, Built, Implemented, Integrated, Maintained, Optimized, Collaborated, Automated, Tested, Debugged, Reviewed, and Deployed.
11. Adjust the responsibilities according to the experience level:
    - Fresher: Learning, academic/internship-style development, debugging, testing, feature implementation, and collaboration.
    - Junior: Feature development, API integration, bug fixing, testing, maintenance, and code reviews.
    - Mid-Level: Designing scalable solutions, optimizing performance, mentoring junior developers, improving code quality, and collaborating across teams.
    - Senior: Leading technical initiatives, system architecture, mentoring engineers, driving best practices, scalability, and technical decision-making.
12. Avoid first-person pronouns (I, me, my).
13. Do NOT use bullet points, markdown, headings, quotation marks, or special formatting.
14. Ensure the description is grammatically correct, concise, and ready to paste directly into an ATS-compatible resume.
15. Return plain text only.

Output:
Return ONLY the work experience description as plain text.
        `;
        const result = await generateAiContent(prompt);
 
        const WorkExperienceDescription = result;

        return NextResponse.json<ApiResponse>({
             success: true,
             message: " Work experience description generated successfully",
             data: { WorkExperienceDescription }
        }, { status: 201 })



     } catch (error) {

          console.log("error in generate experience description api:", error)
          return NextResponse.json<ApiResponse>({
               success: false,
               message: "Something went wrong "
          }, { status: 500 })
     }
}