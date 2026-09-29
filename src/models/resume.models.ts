import mongoose from "mongoose";
import { IResume } from "@/types/resume.types";

const resumeSchema = new mongoose.Schema<IResume>({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        default: "",
    },
    jobTitle: {
        type: String,
        default: "",
    },
    experienceLevel: {
        type: String,
        default: "Fresher",
    },
    summary: {
        type: String,
        default: "",
    },
    personalInfo: {
        name: { type: String, default: "" },
        email: { type: String, default: "" },
        mobile: { type: String, default: "" },
        location: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" },
        portfolio: { type: String, default: "" },
    },
    workExperience: {
        type: [
            {
                company: String,
                position: String,
                startDate: String,
                endDate: String,
                description: String,
            }
        ],
        default: [],
    },
    projects: {
        type: [
            {
                title: String,
                description: String,
                techStack: [String],
                githubUrl: String,
                liveUrl: String,
            }
        ]
    },
    education: {
        type: [
            {
                institute: String,
                degree: String,
                startDate: String,
                endDate: String
            }
        ],
        default: [],
    },
    skills: {
        type: [String],
        default: [],
    },
    certifications: {
        type: [String],
        default: [],
    },


},{
    timestamps: true,
});



const resumeModel = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);
export default resumeModel;