import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import { generateSkillsBody } from "@/types/ai.types";
import { generateAiContent } from "@/lib/gemini";

export async function POST(req: NextRequest) {
     try {

          const body: generateSkillsBody = await req.json()
          const { experienceLevel, jobTitle } = body

          if (!experienceLevel  || !jobTitle) {
               return NextResponse.json<ApiResponse>({
                    success: false,
                    message: "Missing required fields"
               }, { status: 400 })
          }


          const prompt = `
         You are an expert ATS resume writer and technical recruiter.

Your task is to generate ONLY technical skills for a resume.

Input:

Job Title:
${jobTitle}

Experience Level:
${experienceLevel}

Rules:

1. Generate ONLY technical skills relevant to the provided job title and experience level.
2. Do NOT include soft skills, personality traits, or general competencies.
3. Include only technologies such as:
   - Programming languages
   - Frameworks
   - Libraries
   - Databases
   - Cloud platforms
   - DevOps tools
   - Version control
   - Testing tools
   - APIs
   - Build tools
   - Operating systems
   - Other job-specific technical tools
4. Tailor the skills to the specified experience level.
5. Return between 10 and 20 unique skills.
6. Do NOT include duplicate skills.
7. Do NOT include explanations, headings, markdown, code blocks, comments, or any extra text.
8. The response will be parsed directly using JSON.parse().
9. Therefore, the output MUST be a valid JSON object.
10. The value of "skills" MUST be a JSON array, NOT a string.
11. Do NOT wrap the array in quotes.

Return EXACTLY this format:

{
  "skills": [
    "JavaScript",
    "React.js",
    "Node.js",
    "Express.js",
    "MongoDB"
  ]
}

Return ONLY the JSON object.
        `;
        const result = await generateAiContent(prompt);
 
        let skills = result;

        if(typeof skills === 'string') {
             try {
                  const cleanJson = skills.replace(/```json\n?/g, '').replace(/```\n?/g, '');
                  skills = JSON.parse(cleanJson);
             } catch (err) {
                  console.log("Error parsing skills JSON:", err);
             }
        }

        if (skills && !Array.isArray(skills) && Array.isArray(skills.skills)) {
             skills = skills.skills;
        }

        return NextResponse.json<ApiResponse>({
             success: true,
             message: "skills generated successfully",
             data: { skills: Array.isArray(skills) ? skills : [] }
        }, { status: 201 })





     } catch (error) {

          console.log("error in generating skills api:", error)
          return NextResponse.json<ApiResponse>({
               success: false,
               message: "Something went wrong "
          }, { status: 500 })
     }
}