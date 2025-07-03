// Storage utilities for candidate and company data management
// Using CPF for candidates and CNPJ for companies as unique identifiers

export interface CandidatePersonalData {
  cpf: string;
  fullName: string;
  birthDate: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  cep: string;
  about: string;
  profileImage?: string;
}

export interface CandidateExperience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

export interface CandidateEducation {
  id: string;
  degree: string;
  institution: string;
  completionYear: string;
  description?: string;
}

export interface CandidateCourse {
  id: string;
  name: string;
  institution: string;
  hours: number;
  year: string;
}

export interface CandidateLanguage {
  id: string;
  name: string;
  level: string;
  proficiency: number;
  certification?: string;
}

export interface CandidateSkills {
  technical: string[];
  soft: string[];
}

export interface CandidateDocuments {
  resume?: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
}

export interface BehavioralAnalysis {
  section1: {
    collaboration: string;
    problemSolving: string;
    communication: string;
    initiative: string;
    adaptation: string;
    influence: string;
    learning: string;
  };
  section2: {
    workEnvironment: string[];
    values: string[];
    careerGoals: string;
  };
  section3: {
    logicalReasoning: string;
    dataAnalysis: string;
    bigFive0: number;
    bigFive1: number;
    bigFive2: number;
    bigFive3: number;
    bigFive4: number;
    interpersonalSkills: string;
    conflictResolution: string;
    growthMindset: string;
    adaptability: string;
    motivation: string;
    resilience: string;
    creativity: string;
    innovation: string;
    ethics: string;
    values: string;
  };
  aiInsights?: {
    profile: string;
    profileSummary: string;
    enneagramType: {
      type: number;
      name: string;
      description: string;
    };
    bigFiveDistribution: {
      openness: number;
      conscientiousness: number;
      extraversion: number;
      agreeableness: number;
      neuroticism: number;
    };
    behavioralHighlights: {
      communication: string;
      decision: string;
      leadership: string;
      problemSolving: string;
      adaptability: string;
      collaboration: string;
      proactivity: string;
      emotionalIntelligence: string;
    };
    suggestions: {
      recommendedPositions: string[];
      standoutTips: string[];
      developmentAreas: string[];
    };
  };
  completedAt?: string;
}

// Company Interfaces
export interface CompanyData {
  cnpj: string;
  name: string;
  address: string;
  city: string;
  state: string;
  cep: string;
  foundedYear: string;
  employeeCount: string;
  about: string;
  email: string;
  phone: string;
  website?: string;
  industry: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

// Job Interfaces
export interface Job {
  id: string;
  companyCnpj: string;
  title: string;
  area: string;
  contractType: string; // CLT, PJ, Freelancer, Estágio
  workModel: string; // Presencial, Remoto, Híbrido
  city: string;
  salary: string;
  vacancies: number;
  description: string;
  requirements: string;
  benefits?: string;
  status: "active" | "closed" | "paused";
  stages: string[]; // Etapas do processo seletivo
  questions: string[]; // Perguntas da triagem
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  closedAt?: string;
}

// Application Interfaces
export interface JobApplication {
  id: string;
  jobId: string;
  candidateCpf: string;
  companyCnpj: string;
  status: "applied" | "reviewing" | "approved" | "rejected" | "withdrawn";
  currentStage: string; // Current stage in the selection process
  stageHistory: {
    stage: string;
    status: "pending" | "approved" | "rejected";
    date: string;
    notes?: string;
  }[];
  answers: Record<string, string>; // Answers to screening questions
  appliedAt: string;
  updatedAt: string;
}

// User Authentication Interfaces
export interface User {
  id: string;
  email: string;
  password: string; // In production, this should be hashed
  userType: "candidate" | "company";
  cpfOrCnpj: string; // CPF for candidates, CNPJ for companies
  fullName: string; // Individual name or company name
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Notification Interfaces
export interface Notification {
  id: string;
  userId: string; // User ID who should receive the notification
  type:
    | "application"
    | "interview"
    | "profile_view"
    | "job_update"
    | "system"
    | "message";
  title: string;
  message: string;
  data?: Record<string, any>; // Additional data like job ID, application ID, etc.
  isRead: boolean;
  createdAt: string;
}

export interface CandidateData {
  personal: CandidatePersonalData;
  experiences: CandidateExperience[];
  education: CandidateEducation[];
  courses: CandidateCourse[];
  languages: CandidateLanguage[];
  skills: CandidateSkills;
  documents: CandidateDocuments;
  behavioralAnalysis?: BehavioralAnalysis;
  createdAt: string;
  updatedAt: string;
}

// Storage keys
const CANDIDATES_STORAGE_KEY = "candidates_data";
const COMPANIES_STORAGE_KEY = "companies_data";
const JOBS_STORAGE_KEY = "jobs_data";
const APPLICATIONS_STORAGE_KEY = "applications_data";
const USERS_STORAGE_KEY = "users_data";
const NOTIFICATIONS_STORAGE_KEY = "notifications_data";
const CURRENT_USER_KEY = "current_user";
const CURRENT_USER_CPF_KEY = "current_user_cpf";
const CURRENT_COMPANY_CNPJ_KEY = "current_company_cnpj";

// Utility functions
export const formatCPF = (cpf: string): string => {
  const digits = cpf.replace(/\D/g, "");
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const validateCPF = (cpf: string): boolean => {
  const digits = cpf.replace(/\D/g, "");
  return digits.length === 11;
};

export const formatCNPJ = (cnpj: string): string => {
  const digits = cnpj.replace(/\D/g, "");
  return digits.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5",
  );
};

export const validateCNPJ = (cnpj: string): boolean => {
  const digits = cnpj.replace(/\D/g, "");
  return digits.length === 14;
};

// Storage functions
export const getAllCandidates = (): Record<string, CandidateData> => {
  if (typeof window === "undefined") return {};

  try {
    const data = localStorage.getItem(CANDIDATES_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error reading candidates data:", error);
    return {};
  }
};

export const getCandidateData = (cpf: string): CandidateData | null => {
  const candidates = getAllCandidates();
  const cleanCPF = cpf.replace(/\D/g, "");
  return candidates[cleanCPF] || null;
};

export const saveCandidateData = (data: CandidateData): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const candidates = getAllCandidates();
    const cleanCPF = data.personal.cpf.replace(/\D/g, "");

    if (!validateCPF(cleanCPF)) {
      throw new Error("CPF inválido");
    }

    const now = new Date().toISOString();
    candidates[cleanCPF] = {
      ...data,
      updatedAt: now,
      createdAt: data.createdAt || now,
    };

    localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(candidates));

    // Notify components about user data change
    dispatchUserDataChange();

    return true;
  } catch (error) {
    console.error("Error saving candidate data:", error);
    return false;
  }
};

export const updateCandidatePersonalData = (
  cpf: string,
  personalData: CandidatePersonalData,
): boolean => {
  const existingData = getCandidateData(cpf);
  const cleanCPF = cpf.replace(/\D/g, "");

  if (existingData) {
    return saveCandidateData({
      ...existingData,
      personal: personalData,
    });
  } else {
    // Create new candidate record
    const newCandidate: CandidateData = {
      personal: personalData,
      experiences: [],
      education: [],
      courses: [],
      languages: [],
      skills: { technical: [], soft: [] },
      documents: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return saveCandidateData(newCandidate);
  }
};

export const updateCandidateBehavioralAnalysis = (
  cpf: string,
  analysis: BehavioralAnalysis,
): boolean => {
  const existingData = getCandidateData(cpf);

  if (existingData) {
    return saveCandidateData({
      ...existingData,
      behavioralAnalysis: {
        ...analysis,
        completedAt: new Date().toISOString(),
      },
    });
  }
  return false;
};

export const addCandidateExperience = (
  cpf: string,
  experience: Omit<CandidateExperience, "id">,
): boolean => {
  const existingData = getCandidateData(cpf);

  if (existingData) {
    const newExperience: CandidateExperience = {
      ...experience,
      id: Date.now().toString(),
    };

    return saveCandidateData({
      ...existingData,
      experiences: [...existingData.experiences, newExperience],
    });
  }
  return false;
};

export const updateCandidateExperience = (
  cpf: string,
  experienceId: string,
  experience: Partial<CandidateExperience>,
): boolean => {
  const existingData = getCandidateData(cpf);

  if (existingData) {
    const updatedExperiences = existingData.experiences.map((exp) =>
      exp.id === experienceId ? { ...exp, ...experience } : exp,
    );

    return saveCandidateData({
      ...existingData,
      experiences: updatedExperiences,
    });
  }
  return false;
};

export const deleteCandidateExperience = (
  cpf: string,
  experienceId: string,
): boolean => {
  const existingData = getCandidateData(cpf);

  if (existingData) {
    const filteredExperiences = existingData.experiences.filter(
      (exp) => exp.id !== experienceId,
    );

    return saveCandidateData({
      ...existingData,
      experiences: filteredExperiences,
    });
  }
  return false;
};

export const addCandidateEducation = (
  cpf: string,
  education: Omit<CandidateEducation, "id">,
): boolean => {
  const existingData = getCandidateData(cpf);

  if (existingData) {
    const newEducation: CandidateEducation = {
      ...education,
      id: Date.now().toString(),
    };

    return saveCandidateData({
      ...existingData,
      education: [...existingData.education, newEducation],
    });
  }
  return false;
};

export const updateCandidateEducation = (
  cpf: string,
  educationId: string,
  education: Partial<CandidateEducation>,
): boolean => {
  const existingData = getCandidateData(cpf);

  if (existingData) {
    const updatedEducation = existingData.education.map((edu) =>
      edu.id === educationId ? { ...edu, ...education } : edu,
    );

    return saveCandidateData({
      ...existingData,
      education: updatedEducation,
    });
  }
  return false;
};

export const deleteCandidateEducation = (
  cpf: string,
  educationId: string,
): boolean => {
  const existingData = getCandidateData(cpf);

  if (existingData) {
    const filteredEducation = existingData.education.filter(
      (edu) => edu.id !== educationId,
    );

    return saveCandidateData({
      ...existingData,
      education: filteredEducation,
    });
  }
  return false;
};

export const addCandidateCourse = (
  cpf: string,
  course: Omit<CandidateCourse, "id">,
): boolean => {
  const existingData = getCandidateData(cpf);

  if (existingData) {
    const newCourse: CandidateCourse = {
      ...course,
      id: Date.now().toString(),
    };

    return saveCandidateData({
      ...existingData,
      courses: [...existingData.courses, newCourse],
    });
  }
  return false;
};

export const deleteCandidateCourse = (
  cpf: string,
  courseId: string,
): boolean => {
  const existingData = getCandidateData(cpf);

  if (existingData) {
    const filteredCourses = existingData.courses.filter(
      (course) => course.id !== courseId,
    );

    return saveCandidateData({
      ...existingData,
      courses: filteredCourses,
    });
  }
  return false;
};

export const addCandidateLanguage = (
  cpf: string,
  language: Omit<CandidateLanguage, "id">,
): boolean => {
  const existingData = getCandidateData(cpf);

  if (existingData) {
    const newLanguage: CandidateLanguage = {
      ...language,
      id: Date.now().toString(),
    };

    return saveCandidateData({
      ...existingData,
      languages: [...existingData.languages, newLanguage],
    });
  }
  return false;
};

export const deleteCandidateLanguage = (
  cpf: string,
  languageId: string,
): boolean => {
  const existingData = getCandidateData(cpf);

  if (existingData) {
    const filteredLanguages = existingData.languages.filter(
      (lang) => lang.id !== languageId,
    );

    return saveCandidateData({
      ...existingData,
      languages: filteredLanguages,
    });
  }
  return false;
};

export const updateCandidateSkills = (
  cpf: string,
  skills: CandidateSkills,
): boolean => {
  const existingData = getCandidateData(cpf);

  if (existingData) {
    return saveCandidateData({
      ...existingData,
      skills,
    });
  }
  return false;
};

export const updateCandidateDocuments = (
  cpf: string,
  documents: CandidateDocuments,
): boolean => {
  const existingData = getCandidateData(cpf);

  if (existingData) {
    return saveCandidateData({
      ...existingData,
      documents,
    });
  }
  return false;
};

// Current user management (for session)
export const setCurrentUserCPF = (cpf: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CURRENT_USER_CPF_KEY, cpf.replace(/\D/g, ""));
  }
};

export const getCurrentUserCPF = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CURRENT_USER_CPF_KEY);
};

export const getCurrentUserData = (): CandidateData | null => {
  const cpf = getCurrentUserCPF();
  return cpf ? getCandidateData(cpf) : null;
};

// Calculate profile completion percentage
export const calculateProfileCompletion = (data: CandidateData): number => {
  let completed = 0;
  let total = 0;

  // Personal data (weight: 40%)
  const personalFields = ["fullName", "birthDate", "cpf", "email", "phone"];
  personalFields.forEach((field) => {
    total += 8;
    if (data.personal[field as keyof CandidatePersonalData]) completed += 8;
  });

  // Experiences (weight: 20%)
  total += 20;
  if (data.experiences.length > 0) completed += 20;

  // Education (weight: 15%)
  total += 15;
  if (data.education.length > 0) completed += 15;

  // Skills (weight: 15%)
  total += 15;
  if (data.skills.technical.length > 0 || data.skills.soft.length > 0)
    completed += 15;

  // Behavioral analysis (weight: 10%)
  total += 10;
  if (data.behavioralAnalysis) completed += 10;

  return Math.round((completed / total) * 100);
};

// Cancel job application
export const cancelJobApplication = (applicationId: string): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const applications = getAllApplications();
    const application = applications[applicationId];
    if (!application) {
      throw new Error("Application not found");
    }

    // Update application status to withdrawn
    application.status = "withdrawn";
    application.updatedAt = new Date().toISOString();

    // Add to stage history
    application.stageHistory.push({
      stage: "Cancelado",
      status: "rejected",
      date: new Date().toISOString(),
      notes: "Candidatura cancelada pelo candidato",
    });

    applications[applicationId] = application;
    localStorage.setItem(
      APPLICATIONS_STORAGE_KEY,
      JSON.stringify(applications),
    );

    // Notify components about user data change
    dispatchUserDataChange();

    return true;
  } catch (error) {
    console.error("Error canceling application:", error);
    return false;
  }
};

// Reject job application (by company)
export const rejectJobApplication = (
  applicationId: string,
  notes?: string,
): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const applications = getAllApplications();
    const application = applications[applicationId];
    if (!application) {
      throw new Error("Application not found");
    }

    // Update application status to rejected
    application.status = "rejected";
    application.updatedAt = new Date().toISOString();

    // Add to stage history
    application.stageHistory.push({
      stage: "Rejeitado",
      status: "rejected",
      date: new Date().toISOString(),
      notes: notes || "Candidatura rejeitada pela empresa",
    });

    applications[applicationId] = application;
    localStorage.setItem(
      APPLICATIONS_STORAGE_KEY,
      JSON.stringify(applications),
    );

    // Notify components about user data change
    dispatchUserDataChange();

    return true;
  } catch (error) {
    console.error("Error rejecting application:", error);
    return false;
  }
};

// ========== COMPANY STORAGE FUNCTIONS ==========

// Get all companies
export const getAllCompanies = (): Record<string, CompanyData> => {
  if (typeof window === "undefined") return {};

  try {
    const data = localStorage.getItem(COMPANIES_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error reading companies data:", error);
    return {};
  }
};

// Get company data by CNPJ
export const getCompanyData = (cnpj: string): CompanyData | null => {
  const companies = getAllCompanies();
  const cleanCNPJ = cnpj.replace(/\D/g, "");
  return companies[cleanCNPJ] || null;
};

// Save company data
export const saveCompanyData = (data: CompanyData): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const companies = getAllCompanies();
    const cleanCNPJ = data.cnpj.replace(/\D/g, "");

    if (!validateCNPJ(cleanCNPJ)) {
      throw new Error("CNPJ inválido");
    }

    const now = new Date().toISOString();
    const updatedCompany = {
      ...data,
      updatedAt: now,
      createdAt: data.createdAt || now,
    };

    // Check if logo is too large
    if (updatedCompany.logo) {
      const logoSize = new Blob([updatedCompany.logo]).size;
      if (logoSize > 1024 * 1024) {
        // 1MB limit
        console.warn("Logo size is too large:", logoSize);
        // Keep the company data but remove the oversized logo
        updatedCompany.logo = "";
        throw new Error(
          "A imagem é muito grande. Por favor, use uma imagem menor.",
        );
      }
    }

    companies[cleanCNPJ] = updatedCompany;

    // Test the storage size before committing
    const dataToStore = JSON.stringify(companies);
    const dataSize = new Blob([dataToStore]).size;

    if (dataSize > 4 * 1024 * 1024) {
      // 4MB limit (leaving some buffer)
      throw new Error(
        "Limite de armazenamento atingido. Tente usar uma imagem menor ou remover dados desnecessários.",
      );
    }

    localStorage.setItem(COMPANIES_STORAGE_KEY, dataToStore);

    // Notify components about user data change
    dispatchUserDataChange();

    return true;
  } catch (error) {
    console.error("Error saving company data:", error);

    // Specific error handling for quota exceeded
    if (error instanceof Error) {
      if (
        error.name === "QuotaExceededError" ||
        error.message.includes("quota")
      ) {
        // Try to free up space by cleaning old data
        console.log("Quota exceeded, attempting to clean up storage...");

        const notificationsCleaned = cleanupOldNotifications();
        const companiesOptimized = optimizeCompanyStorage();

        if (notificationsCleaned || companiesOptimized) {
          try {
            // Try saving again after cleanup
            localStorage.setItem(COMPANIES_STORAGE_KEY, dataToStore);
            console.log("Successfully saved after cleanup");
            return true;
          } catch (retryError) {
            console.error("Still failed after cleanup:", retryError);
          }
        }

        throw new Error(
          "Limite de armazenamento atingido. A imagem pode ser muito grande. Tente usar uma imagem menor ou com menor qualidade.",
        );
      }
      // Re-throw our custom errors
      if (
        error.message.includes("muito grande") ||
        error.message.includes("armazenamento")
      ) {
        throw error;
      }
    }

    throw new Error("Erro ao salvar dados da empresa. Tente novamente.");
  }
};

// Current company management
export const setCurrentCompanyCNPJ = (cnpj: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CURRENT_COMPANY_CNPJ_KEY, cnpj.replace(/\D/g, ""));
  }
};

export const getCurrentCompanyCNPJ = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CURRENT_COMPANY_CNPJ_KEY);
};

export const getCurrentCompanyData = (): CompanyData | null => {
  const cnpj = getCurrentCompanyCNPJ();
  return cnpj ? getCompanyData(cnpj) : null;
};

// ========== JOB STORAGE FUNCTIONS ==========

// Get all jobs
export const getAllJobs = (): Record<string, Job> => {
  if (typeof window === "undefined") return {};

  try {
    const data = localStorage.getItem(JOBS_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error reading jobs data:", error);
    return {};
  }
};

// Get job by ID
export const getJobById = (jobId: string): Job | null => {
  const jobs = getAllJobs();
  return jobs[jobId] || null;
};

// Get jobs by company CNPJ
export const getJobsByCompany = (cnpj: string): Job[] => {
  const jobs = getAllJobs();
  const cleanCNPJ = cnpj.replace(/\D/g, "");
  return Object.values(jobs).filter((job) => job.companyCnpj === cleanCNPJ);
};

// Get active jobs by company
export const getActiveJobsByCompany = (cnpj: string): Job[] => {
  return getJobsByCompany(cnpj).filter((job) => job.status === "active");
};

// Get closed jobs by company
export const getClosedJobsByCompany = (cnpj: string): Job[] => {
  return getJobsByCompany(cnpj).filter((job) => job.status === "closed");
};

// Save job
export const saveJob = (job: Job): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const jobs = getAllJobs();
    const now = new Date().toISOString();

    jobs[job.id] = {
      ...job,
      updatedAt: now,
      createdAt: job.createdAt || now,
    };

    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
    return true;
  } catch (error) {
    console.error("Error saving job:", error);
    return false;
  }
};

// Create new job
export const createJob = (
  jobData: Omit<Job, "id" | "createdAt" | "updatedAt">,
): string | null => {
  try {
    const jobId = Date.now().toString();
    const now = new Date().toISOString();

    const job: Job = {
      ...jobData,
      id: jobId,
      createdAt: now,
      updatedAt: now,
    };

    const success = saveJob(job);
    return success ? jobId : null;
  } catch (error) {
    console.error("Error creating job:", error);
    return null;
  }
};

// Update job status
export const updateJobStatus = (
  jobId: string,
  status: Job["status"],
): boolean => {
  const job = getJobById(jobId);
  if (!job) return false;

  const updatedJob = {
    ...job,
    status,
    closedAt: status === "closed" ? new Date().toISOString() : job.closedAt,
  };

  return saveJob(updatedJob);
};

// Delete job
export const deleteJob = (jobId: string): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const jobs = getAllJobs();
    delete jobs[jobId];
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
    return true;
  } catch (error) {
    console.error("Error deleting job:", error);
    return false;
  }
};

// Application Management Functions

// Get all applications
export const getAllApplications = (): Record<string, JobApplication> => {
  if (typeof window === "undefined") return {};

  try {
    const data = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error reading applications data:", error);
    return {};
  }
};

// Get application by ID
export const getApplicationById = (
  applicationId: string,
): JobApplication | null => {
  const applications = getAllApplications();
  return applications[applicationId] || null;
};

// Get applications by candidate CPF
export const getApplicationsByCandidateCpf = (
  cpf: string,
): JobApplication[] => {
  const applications = getAllApplications();
  const cleanCPF = cpf.replace(/\D/g, "");
  return Object.values(applications).filter(
    (app) => app.candidateCpf === cleanCPF,
  );
};

// Get applications by company CNPJ
export const getApplicationsByCompanyCnpj = (
  cnpj: string,
): JobApplication[] => {
  const applications = getAllApplications();
  const cleanCNPJ = cnpj.replace(/\D/g, "");
  return Object.values(applications).filter(
    (app) => app.companyCnpj === cleanCNPJ,
  );
};

// Get applications by job ID
export const getApplicationsByJobId = (jobId: string): JobApplication[] => {
  const applications = getAllApplications();
  return Object.values(applications).filter((app) => app.jobId === jobId);
};

// Get applications by stage for a job
export const getApplicationsByJobStage = (
  jobId: string,
  stage: string,
): JobApplication[] => {
  const applications = getApplicationsByJobId(jobId);
  return applications.filter((app) => app.currentStage === stage);
};

// Create new job application
export const createJobApplication = (
  jobId: string,
  candidateCpf: string,
  answers: Record<string, string> = {},
): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const job = getJobById(jobId);
    if (!job || job.status !== "active") {
      throw new Error("Job not found or not active");
    }

    const cleanCPF = candidateCpf.replace(/\D/g, "");
    console.log("Looking for candidate with CPF:", cleanCPF);

    const candidate = getCandidateData(cleanCPF);
    console.log("Found candidate:", candidate);

    if (!candidate) {
      // Try to create basic candidate data if user exists but candidate data is missing
      const allUsers = getAllUsers();
      const user = Object.values(allUsers).find(
        (u) => u.cpfOrCnpj === cleanCPF && u.userType === "candidate",
      );

      if (user) {
        console.log("User found, creating basic candidate data...");
        // Create basic candidate data
        const basicCandidateData: CandidatePersonalData = {
          cpf: cleanCPF,
          fullName: user.fullName,
          email: user.email,
          birthDate: "",
          gender: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          cep: "",
          about: "",
        };

        const success = updateCandidatePersonalData(
          cleanCPF,
          basicCandidateData,
        );
        if (!success) {
          throw new Error("Failed to create candidate profile");
        }

        // Try to get candidate data again
        const newCandidate = getCandidateData(cleanCPF);
        if (!newCandidate) {
          throw new Error("Failed to retrieve created candidate profile");
        }
      } else {
        throw new Error(
          "User account not found. Please make sure you are logged in as a candidate.",
        );
      }
    }

    // Check if already applied
    const existingApplications = getApplicationsByJobId(jobId);
    const alreadyApplied = existingApplications.some(
      (app) => app.candidateCpf === cleanCPF,
    );
    if (alreadyApplied) {
      throw new Error("Already applied for this job");
    }

    const applications = getAllApplications();
    const applicationId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const newApplication: JobApplication = {
      id: applicationId,
      jobId,
      candidateCpf: cleanCPF,
      companyCnpj: job.companyCnpj,
      status: "applied",
      currentStage: job.stages[0] || "Triagem",
      stageHistory: [
        {
          stage: job.stages[0] || "Triagem",
          status: "pending",
          date: now,
        },
      ],
      answers,
      appliedAt: now,
      updatedAt: now,
    };

    applications[applicationId] = newApplication;
    localStorage.setItem(
      APPLICATIONS_STORAGE_KEY,
      JSON.stringify(applications),
    );
    return applicationId;
  } catch (error) {
    console.error("Error creating application:", error);
    return null;
  }
};

// Update application stage
export const updateApplicationStage = (
  applicationId: string,
  newStage: string,
  status: "approved" | "rejected" = "approved",
  notes?: string,
): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const applications = getAllApplications();
    const application = applications[applicationId];
    if (!application) {
      throw new Error("Application not found");
    }

    const now = new Date().toISOString();

    // Update stage history
    application.stageHistory.push({
      stage: newStage,
      status: "pending",
      date: now,
      notes,
    });

    // Update current stage and status
    application.currentStage = newStage;
    application.status = status === "approved" ? "reviewing" : "rejected";
    application.updatedAt = now;

    applications[applicationId] = application;
    localStorage.setItem(
      APPLICATIONS_STORAGE_KEY,
      JSON.stringify(applications),
    );
    return true;
  } catch (error) {
    console.error("Error updating application stage:", error);
    return false;
  }
};

// User Management Functions

// Get all users
export const getAllUsers = (): Record<string, User> => {
  if (typeof window === "undefined") return {};

  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error reading users data:", error);
    return {};
  }
};

// Get user by email
export const getUserByEmail = (email: string): User | null => {
  const users = getAllUsers();
  return (
    Object.values(users).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    ) || null
  );
};

// Get user by CPF or CNPJ
export const getUserByCpfOrCnpj = (cpfOrCnpj: string): User | null => {
  const users = getAllUsers();
  const cleanDoc = cpfOrCnpj.replace(/\D/g, "");
  return (
    Object.values(users).find((user) => user.cpfOrCnpj === cleanDoc) || null
  );
};

// Create new user
export const createUser = (
  email: string,
  password: string,
  userType: "candidate" | "company",
  cpfOrCnpj: string,
  fullName: string,
): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const cleanDoc = cpfOrCnpj.replace(/\D/g, "");

    // Validate document
    if (userType === "candidate" && !validateCPF(cleanDoc)) {
      throw new Error("CPF inválido");
    }
    if (userType === "company" && !validateCNPJ(cleanDoc)) {
      throw new Error("CNPJ inválido");
    }

    // Check if email already exists
    if (getUserByEmail(email)) {
      throw new Error("Email já cadastrado");
    }

    // Check if CPF/CNPJ already exists
    if (getUserByCpfOrCnpj(cleanDoc)) {
      throw new Error("CPF/CNPJ já cadastrado");
    }

    const users = getAllUsers();
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const newUser: User = {
      id: userId,
      email: email.toLowerCase(),
      password: password.trim(), // Trim password to avoid whitespace issues
      userType,
      cpfOrCnpj: cleanDoc,
      fullName,
      isVerified: false,
      createdAt: now,
      updatedAt: now,
    };

    console.log("Creating new user:", {
      email: newUser.email,
      password: newUser.password,
      userType: newUser.userType,
    });

    users[userId] = newUser;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    console.log("User created successfully with ID:", userId);
    return userId;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

// Authenticate user (login)
export const authenticateUser = (
  email: string,
  password: string,
): User | null => {
  try {
    console.log("Attempting authentication for email:", email);

    const user = getUserByEmail(email);
    if (!user) {
      console.log("User not found for email:", email);
      throw new Error("Usuário não encontrado");
    }

    console.log("User found:", {
      id: user.id,
      email: user.email,
      userType: user.userType,
    });
    console.log("Password comparison:", {
      provided: password,
      stored: user.password,
      match: user.password === password,
    });

    // Trim whitespace and compare passwords
    const trimmedProvidedPassword = password.trim();
    const trimmedStoredPassword = user.password.trim();

    if (trimmedStoredPassword !== trimmedProvidedPassword) {
      console.log("Password mismatch after trimming:", {
        provided: trimmedProvidedPassword,
        stored: trimmedStoredPassword,
      });
      throw new Error("Senha incorreta");
    }

    console.log("Authentication successful for user:", user.email);
    return user;
  } catch (error) {
    console.error("Error authenticating user:", error);
    return null;
  }
};

// Helper function to dispatch user data change event
const dispatchUserDataChange = (): void => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("userDataChanged"));
  }
};

// Current session management
export const setCurrentUser = (user: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

    // Also set the old keys for backward compatibility
    if (user.userType === "candidate") {
      setCurrentUserCPF(user.cpfOrCnpj);
    } else {
      setCurrentCompanyCNPJ(user.cpfOrCnpj);
    }

    // Notify components about user data change
    dispatchUserDataChange();
  }
};

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;

  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const logout = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(CURRENT_USER_CPF_KEY);
    localStorage.removeItem(CURRENT_COMPANY_CNPJ_KEY);

    // Notify components about user data change
    dispatchUserDataChange();
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

// Get user dashboard URL based on type
export const getUserDashboardUrl = (
  userType: "candidate" | "company",
): string => {
  return userType === "candidate"
    ? "/dashboard/candidate"
    : "/dashboard/company";
};

// Get localStorage usage information
export const getStorageInfo = (): {
  used: number;
  total: number;
  percentage: number;
} => {
  if (typeof window === "undefined")
    return { used: 0, total: 0, percentage: 0 };

  let used = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length + key.length;
    }
  }

  // Rough estimate of localStorage limit (5MB for most browsers)
  const total = 5 * 1024 * 1024;
  const percentage = (used / total) * 100;

  return { used, total, percentage };
};

// Clean up old notifications to free space
export const cleanupOldNotifications = (): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const notifications = getAllNotifications();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const filteredNotifications: Record<string, Notification> = {};
    let cleaned = false;

    Object.entries(notifications).forEach(([id, notification]) => {
      const notifDate = new Date(notification.createdAt);
      if (notifDate > thirtyDaysAgo) {
        filteredNotifications[id] = notification;
      } else {
        cleaned = true;
      }
    });

    if (cleaned) {
      localStorage.setItem(
        NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify(filteredNotifications),
      );
    }

    return cleaned;
  } catch (error) {
    console.error("Error cleaning notifications:", error);
    return false;
  }
};

// Optimize company data by removing large logos if needed
export const optimizeCompanyStorage = (): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const companies = getAllCompanies();
    let optimized = false;

    Object.entries(companies).forEach(([cnpj, company]) => {
      if (company.logo) {
        const logoSize = new Blob([company.logo]).size;
        if (logoSize > 500 * 1024) {
          // Remove logos larger than 500KB
          company.logo = "";
          optimized = true;
        }
      }
    });

    if (optimized) {
      localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(companies));
    }

    return optimized;
  } catch (error) {
    console.error("Error optimizing company storage:", error);
    return false;
  }
};

// Debug function to list all users
export const debugListAllUsers = (): void => {
  if (typeof window !== "undefined") {
    const users = getAllUsers();
    console.log("All users in storage:", users);
    console.log("Number of users:", Object.keys(users).length);
  }
};

// Debug function to find user by email (with logging)
export const debugFindUserByEmail = (email: string): User | null => {
  console.log("Debug: Searching for user with email:", email);
  const users = getAllUsers();
  console.log(
    "Debug: All users:",
    Object.values(users).map((u) => ({
      id: u.id,
      email: u.email,
      userType: u.userType,
    })),
  );

  const user = Object.values(users).find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );

  console.log(
    "Debug: Found user:",
    user ? { id: user.id, email: user.email, userType: user.userType } : null,
  );
  return user || null;
};

// Clear all storage data (for testing/debugging)
export const clearAllStorage = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CANDIDATES_STORAGE_KEY);
    localStorage.removeItem(COMPANIES_STORAGE_KEY);
    localStorage.removeItem(JOBS_STORAGE_KEY);
    localStorage.removeItem(APPLICATIONS_STORAGE_KEY);
    localStorage.removeItem(USERS_STORAGE_KEY);
    localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(CURRENT_USER_CPF_KEY);
    localStorage.removeItem(CURRENT_COMPANY_CNPJ_KEY);
    console.log("All storage data cleared");
  }
};

// Notification Management Functions

// Get all notifications
export const getAllNotifications = (): Record<string, Notification> => {
  if (typeof window === "undefined") return {};

  try {
    const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error reading notifications data:", error);
    return {};
  }
};

// Get notifications by user ID
export const getNotificationsByUserId = (userId: string): Notification[] => {
  const notifications = getAllNotifications();
  return Object.values(notifications)
    .filter((notification) => notification.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
};

// Get unread notifications count
export const getUnreadNotificationsCount = (userId: string): number => {
  const notifications = getNotificationsByUserId(userId);
  return notifications.filter((notification) => !notification.isRead).length;
};

// Create notification
export const createNotification = (
  userId: string,
  type: Notification["type"],
  title: string,
  message: string,
  data?: Record<string, any>,
): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const notifications = getAllNotifications();
    const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const newNotification: Notification = {
      id: notificationId,
      userId,
      type,
      title,
      message,
      data,
      isRead: false,
      createdAt: now,
    };

    notifications[notificationId] = newNotification;
    localStorage.setItem(
      NOTIFICATIONS_STORAGE_KEY,
      JSON.stringify(notifications),
    );
    return notificationId;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

// Mark notification as read
export const markNotificationAsRead = (notificationId: string): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const notifications = getAllNotifications();
    const notification = notifications[notificationId];
    if (!notification) return false;

    notification.isRead = true;
    notifications[notificationId] = notification;
    localStorage.setItem(
      NOTIFICATIONS_STORAGE_KEY,
      JSON.stringify(notifications),
    );
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = (userId: string): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const notifications = getAllNotifications();
    let updated = false;

    Object.values(notifications).forEach((notification) => {
      if (notification.userId === userId && !notification.isRead) {
        notification.isRead = true;
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem(
        NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify(notifications),
      );
    }
    return updated;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return false;
  }
};

// Calculate candidate statistics based on applications
export const getCandidateStatistics = (
  cpf: string,
): {
  applications: number;
  interviews: number;
  profileViews: number;
  matchRate: number;
} => {
  const cleanCPF = cpf.replace(/\D/g, "");
  const applications = getApplicationsByCandidateCpf(cleanCPF);

  const stats = {
    applications: applications.length,
    interviews: applications.filter(
      (app) =>
        app.currentStage.toLowerCase().includes("entrevista") ||
        app.currentStage.toLowerCase().includes("interview"),
    ).length,
    profileViews: Math.floor(Math.random() * 50) + applications.length * 2, // Mock for now
    matchRate:
      applications.length > 0
        ? Math.floor(
            (applications.filter((app) => app.status !== "rejected").length /
              applications.length) *
              100,
          )
        : 0,
  };

  return stats;
};

// Get recent applications for candidate
export const getRecentApplications = (
  cpf: string,
  limit: number = 5,
): JobApplication[] => {
  const cleanCPF = cpf.replace(/\D/g, "");
  const applications = getApplicationsByCandidateCpf(cleanCPF);

  return applications
    .sort(
      (a, b) =>
        new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
    )
    .slice(0, limit);
};

// Job compatibility calculation interface
export interface JobCompatibility {
  jobId: string;
  compatibilityScore: number;
  compatibilityLevel: "Baixa" | "Média" | "Alta";
  reasons: string[];
  job: Job;
  company: CompanyData | null;
}

// Calculate similarity between two arrays of strings
const calculateSimilarity = (arr1: string[], arr2: string[]): number => {
  if (arr1.length === 0 || arr2.length === 0) return 0;

  const set1 = new Set(arr1.map((item) => item.toLowerCase().trim()));
  const set2 = new Set(arr2.map((item) => item.toLowerCase().trim()));

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
};

// Extract keywords from text
const extractKeywords = (text: string): string[] => {
  if (!text) return [];

  const stopWords = new Set([
    "o",
    "a",
    "de",
    "do",
    "da",
    "em",
    "um",
    "uma",
    "com",
    "para",
    "por",
    "se",
    "no",
    "na",
    "que",
    "não",
    "é",
    "e",
    "ou",
    "as",
    "os",
    "dos",
    "das",
    "ao",
    "à",
    "ser",
    "ter",
    "estar",
    "como",
    "mais",
    "muito",
    "bem",
    "já",
    "também",
    "the",
    "and",
    "or",
    "of",
    "to",
    "in",
    "for",
    "with",
    "on",
    "at",
    "by",
    "from",
  ]);

  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 2 && !stopWords.has(word))
    .slice(0, 20); // Limit to top 20 keywords
};

// Calculate job compatibility for a candidate
export const calculateJobCompatibility = (
  candidateData: CandidateData,
  job: Job,
  company: CompanyData | null,
): JobCompatibility => {
  let totalScore = 0;
  const reasons: string[] = [];

  // 1. Skills compatibility (40% weight)
  const candidateSkills = [
    ...(candidateData.skills.technical || []),
    ...(candidateData.skills.soft || []),
  ];

  // Extract skills from job requirements
  const jobRequirements = `${job.requirements || ""} ${job.description || ""}`;
  const jobKeywords = extractKeywords(jobRequirements);

  const skillsSimilarity = calculateSimilarity(candidateSkills, jobKeywords);
  const skillsScore = skillsSimilarity * 40;
  totalScore += skillsScore;

  if (skillsSimilarity > 0.3) {
    reasons.push(
      `${Math.round(skillsSimilarity * 100)}% de compatibilidade em habilidades`,
    );
  }

  // 2. Professional area compatibility (25% weight)
  let areaScore = 0;
  if (candidateData.experiences.length > 0) {
    const candidateAreas = candidateData.experiences.map((exp) =>
      exp.title.toLowerCase(),
    );
    const jobTitle = job.title.toLowerCase();
    const jobArea = job.area.toLowerCase();

    const hasAreaMatch = candidateAreas.some(
      (area) =>
        area.includes(jobArea) ||
        jobArea.includes(area) ||
        area.includes(jobTitle) ||
        jobTitle.includes(area),
    );

    if (hasAreaMatch) {
      areaScore = 25;
      reasons.push(`Experiência na área de ${job.area}`);
    } else if (job.area === candidateData.experiences[0]?.title) {
      areaScore = 20;
      reasons.push(`Área relacionada à sua experiência`);
    }
  }
  totalScore += areaScore;

  // 3. Experience level compatibility (20% weight)
  let experienceScore = 0;
  const candidateYearsOfExperience = candidateData.experiences.length;

  if (candidateYearsOfExperience > 0) {
    experienceScore = Math.min(20, candidateYearsOfExperience * 5);
    if (candidateYearsOfExperience >= 3) {
      reasons.push(
        `${candidateYearsOfExperience} experiências profissionais registradas`,
      );
    }
  }
  totalScore += experienceScore;

  // 4. Location compatibility (10% weight)
  let locationScore = 0;
  if (job.workModel === "Remoto") {
    locationScore = 10;
    reasons.push("Trabalho remoto disponível");
  } else if (candidateData.personal.city && job.city) {
    const candidateCity = candidateData.personal.city.toLowerCase();
    const jobCity = job.city.toLowerCase();
    const candidateState = candidateData.personal.state?.toLowerCase() || "";
    const companyState = company?.state?.toLowerCase() || "";

    if (candidateCity.includes(jobCity) || jobCity.includes(candidateCity)) {
      locationScore = 10;
      reasons.push("Localização compatível");
    } else if (
      candidateState &&
      companyState &&
      candidateState === companyState
    ) {
      locationScore = 7;
      reasons.push("Mesmo estado");
    }
  }
  totalScore += locationScore;

  // 5. Education and courses compatibility (5% weight)
  let educationScore = 0;
  if (candidateData.education.length > 0 || candidateData.courses.length > 0) {
    educationScore = 5;
    reasons.push("Formação acadêmica registrada");
  }
  totalScore += educationScore;

  // Determine compatibility level
  let compatibilityLevel: "Baixa" | "Média" | "Alta";
  if (totalScore >= 70) {
    compatibilityLevel = "Alta";
  } else if (totalScore >= 40) {
    compatibilityLevel = "Média";
  } else {
    compatibilityLevel = "Baixa";
  }

  return {
    jobId: job.id,
    compatibilityScore: Math.round(totalScore),
    compatibilityLevel,
    reasons: reasons.slice(0, 3), // Limit to top 3 reasons
    job,
    company,
  };
};

// Get compatible jobs for a candidate
export const getCompatibleJobs = (candidateCpf: string): JobCompatibility[] => {
  const cleanCPF = candidateCpf.replace(/\D/g, "");
  const candidateData = getCandidateData(cleanCPF);

  if (!candidateData) {
    return [];
  }

  const allJobs = getAllJobs();
  const activeJobs = Object.values(allJobs).filter(
    (job) => job.status === "active",
  );

  const compatibilities: JobCompatibility[] = activeJobs.map((job) => {
    const company = getCompanyData(job.companyCnpj);
    return calculateJobCompatibility(candidateData, job, company);
  });

  // Sort by compatibility score (highest first)
  return compatibilities.sort(
    (a, b) => b.compatibilityScore - a.compatibilityScore,
  );
};
