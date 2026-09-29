import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import { generateSummaryBody } from "@/types/ai.types";
import { generateAiContent } from "@/lib/gemini";

export async function POST(req: NextRequest) {
     try {

          const body: generateSummaryBody = await req.json()
          const { experienceLevel, skills, jobTitle } = body

          if (!experienceLevel || !skills || !jobTitle) {
               return NextResponse.json<ApiResponse>({
                    success: false,
                    message: "Missing required fields"
               }, { status: 400 })
          }


          const prompt = `
          You are an expert ATS (Applicant Tracking System) resume writer and professional career coach.

          Your task is to generate ONLY a professional resume summary.

            Input:

            Job Title:
            ${jobTitle}

            Skills:
            ${skills}

            Experience Level:
            ${experienceLevel}

             Rules:

          1. Generate ONLY the resume summary.
          2. Do NOT add any heading like "Summary", "Professional Summary", or any title.
          3. Length should be between 60–100 words (4–6 concise sentences).
          4. Make it ATS-friendly by naturally incorporating the provided job title, skills, and relevant keywords.
          5. Use strong professional language and impactful action-oriented wording.
          6. Tailor the summary according to the experience level:
             - Fresher: Highlight education, projects, internships, technical skills, eagerness to learn, and potential.
             - Junior: Emphasize practical experience, contributions, technical proficiency, and growth.
             - Mid-Level: Focus on ownership, achievements, collaboration, and problem-solving.
             - Senior: Highlight leadership, strategic thinking, mentoring, architecture, and business impact.
          7. Never invent companies, certifications, years of experience, achievements, or technologies that are not implied by the           provided information.
          8. If skills are missing or limited, write a strong, professional summary using the available information without mentioning           missing data.
          9. Keep the writing confident, concise, and free from clichés or unnecessary buzzwords.
          10. Avoid first-person pronouns (I, me, my).
          11. Do not use bullet points, markdown, emojis, or quotation marks.
          12. Return plain text only.
          13. Ensure the summary reads naturally and is suitable for direct placement into a modern ATS-compatible resume.
          
          Output:
          Return ONLY the resume summary as plain text.
        `;
        const result = await generateAiContent(prompt);
 
        const summary = result;

        return NextResponse.json<ApiResponse>({
             success: true,
             message: "Summary generated successfully",
             data: { summary }
        }, { status: 201 })





     } catch (error) {

          console.log("error in generate summary api:", error)
          return NextResponse.json<ApiResponse>({
               success: false,
               message: "Something went wrong "
          }, { status: 500 })
     }
}