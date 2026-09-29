import { Types } from "mongoose";

 export interface IPersonalInfo {
    name: string;
    email: string;
    mobile: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
}

export interface IWorkExperience {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
}


export interface IProjects {
    name: string;
    description: string;
    techStack: string[];
    githubUrl: string;
    liveUrl: string;
}

export interface IEducation {
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
}

export interface IResume {
   _id?: string;
   user_id: Types.ObjectId;
   title: string;
    jobTitle?: string;
    experienceLevel?: string;
   summary: string;
    personalInfo: IPersonalInfo;
    workExperience: IWorkExperience[];
    projects: IProjects[];
    skills: string[];
    education: IEducation[];
    certifications?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}