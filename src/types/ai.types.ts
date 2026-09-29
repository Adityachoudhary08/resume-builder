  


 export  interface generateSummaryBody{
    experienceLevel: string;
    skills: string[];
    jobTitle: string;

  }

  export interface generateSkillsBody{
    experienceLevel: string;
    jobTitle: string;
  }

  export interface generateProjectDescriptionBody{
    experienceLevel: string;
    techStack: string[];
    jobTitle: string;
  }


  export interface generateExperienceDescriptionBody{
    experienceLevel: string;
    techStack: string[];
    yearsOfExperience: number;
    jobRole: string;
  }


  export interface ImproveContentBody{
    content: string;
  }

  export interface atsScoreBody{
    ResumeText: string;
  }