"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Preloader from "@/components/preloader";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Building,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import {
  getJobById,
  getCompanyData,
  getCurrentUser,
  createJobApplication,
  getApplicationsByJobId,
  getCandidateData,
  type Job,
  type CompanyData,
} from "@/lib/storage";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadJobData(params.id as string);
    }
  }, [params.id]);

  const loadJobData = async (jobId: string) => {
    try {
      const jobData = getJobById(jobId);
      if (!jobData) {
        router.push("/jobs");
        return;
      }

      setJob(jobData);

      // Get company data
      const companyData = getCompanyData(jobData.companyCnpj);
      setCompany(companyData);

      // Check if user is logged in and if they have applied
      const user = getCurrentUser();
      setCurrentUser(user);

      if (user && user.userType === "candidate") {
        const applications = getApplicationsByJobId(jobId);
        const cleanCPF = user.cpfOrCnpj.replace(/\D/g, "");
        const userApplication = applications.find(
          (app) => app.candidateCpf === cleanCPF,
        );
        setHasApplied(!!userApplication);

        // Check if candidate profile exists
        const candidateData = getCandidateData(cleanCPF);
        if (!candidateData) {
          console.log("No candidate profile found for user:", user.cpfOrCnpj);
        }
      }
    } catch (error) {
      console.error("Error loading job:", error);
      router.push("/jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }

    if (currentUser.userType !== "candidate") {
      alert("Apenas candidatos podem se candidatar a vagas");
      return;
    }

    setApplying(true);
    try {
      const applicationId = createJobApplication(
        job!.id,
        currentUser.cpfOrCnpj,
        {}, // No screening questions for now
      );

      if (applicationId) {
        setHasApplied(true);
        alert("Candidatura realizada com sucesso!");
      } else {
        alert(
          "Erro ao realizar candidatura. Você pode já ter se candidatado a esta vaga.",
        );
      }
    } catch (error) {
      console.error("Error applying to job:", error);
      if (error instanceof Error) {
        if (
          error.message.includes("Candidate not found") ||
          error.message.includes("User account not found")
        ) {
          alert(
            "Perfil de candidato não encontrado. Por favor, complete seu cadastro primeiro.",
          );
          router.push("/dashboard/candidate/profile/edit");
        } else if (error.message.includes("Already applied")) {
          alert("Você já se candidatou a esta vaga.");
        } else {
          alert(`Erro ao realizar candidatura: ${error.message}`);
        }
      } else {
        alert("Erro inesperado ao realizar candidatura");
      }
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Hoje";
    if (diffDays === 2) return "Ontem";
    if (diffDays <= 7) return `${diffDays} dias atrás`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} semanas atrás`;
    return `${Math.ceil(diffDays / 30)} meses atrás`;
  };

  if (loading) {
    return (
      <>
        <Preloader />
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando vaga...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Vaga não encontrada
            </h1>
            <p className="text-gray-600 mb-6">
              A vaga que você está procurando não existe ou foi removida.
            </p>
            <button
              onClick={() => router.push("/jobs")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Ver Todas as Vagas
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Preloader />
      <Header />

      <main>
        <div className="py-8">
          <div className="container mx-auto px-4">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para vagas
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Job Header */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {company?.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Building className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        {job.title}
                      </h1>
                      <ul className="space-y-1 text-gray-600">
                        <li className="font-semibold text-lg">
                          {company?.name || "Empresa não encontrada"}
                        </li>
                        <li className="flex items-center">
                          <MapPin size={16} className="mr-2" />
                          {job.city}
                          {company?.state ? `, ${company.state}` : ""}
                        </li>
                        {job.salary && (
                          <li className="text-green-600 font-semibold text-lg">
                            {job.salary}
                          </li>
                        )}
                      </ul>
                      <div className="flex gap-2 mt-3">
                        <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                          {job.workModel}
                        </span>
                        <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                          {job.contractType}
                        </span>
                        <span className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                          {job.area}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="mb-8">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">
                      Descrição da Vaga
                    </h4>
                    <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {job.description}
                    </div>
                  </div>

                  {job.requirements && (
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">
                        Requisitos
                      </h4>
                      <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {job.requirements}
                      </div>
                    </div>
                  )}

                  {job.benefits && (
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">
                        Benefícios
                      </h4>
                      <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {job.benefits}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Application Button */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  {hasApplied ? (
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Candidatura Enviada
                      </h4>
                      <p className="text-sm text-gray-600">
                        Sua candidatura foi enviada com sucesso!
                      </p>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={handleApply}
                        disabled={applying || job.status !== "active"}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-md transition-colors"
                      >
                        {applying ? "Enviando..." : "Candidatar-se"}
                      </button>
                      {!currentUser && (
                        <p className="text-xs text-gray-500 text-center mt-2">
                          É necessário fazer login para se candidatar
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Job Info */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">
                    Informações da Vaga
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">
                        Publicado:
                      </span>
                      <span className="text-gray-600">
                        {formatTimeAgo(job.createdAt)}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Data:</span>
                      <span className="text-gray-600">
                        {formatDate(job.createdAt)}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Local:</span>
                      <span className="text-gray-600">{job.city}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Vagas:</span>
                      <span className="text-gray-600">{job.vacancies}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">
                        Modalidade:
                      </span>
                      <span className="text-gray-600">{job.workModel}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">
                        Contrato:
                      </span>
                      <span className="text-gray-600">{job.contractType}</span>
                    </li>
                    {job.salary && (
                      <li className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">
                          Salário:
                        </span>
                        <span className="text-green-600 font-semibold">
                          {job.salary}
                        </span>
                      </li>
                    )}
                    <li className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Status:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === "active"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {job.status === "active" ? "Ativa" : "Encerrada"}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Company Info */}
                {company && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">
                      Sobre a Empresa
                    </h4>
                    <div className="flex items-center gap-3 mb-4">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Building className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h6 className="font-semibold text-gray-800">
                          {company.name}
                        </h6>
                        <p className="text-sm text-gray-600">
                          {company.industry}
                        </p>
                      </div>
                    </div>

                    {company.about && (
                      <p className="text-gray-600 mb-4">{company.about}</p>
                    )}

                    <ul className="space-y-2 text-sm">
                      {company.website && (
                        <li>
                          <span className="font-medium text-gray-700">
                            Site:
                          </span>
                          <a
                            href={
                              company.website.startsWith("http")
                                ? company.website
                                : `https://${company.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 ml-2 hover:underline"
                          >
                            {company.website}
                          </a>
                        </li>
                      )}
                      {company.email && (
                        <li>
                          <span className="font-medium text-gray-700">
                            Email:
                          </span>
                          <a
                            href={`mailto:${company.email}`}
                            className="text-blue-600 ml-2 hover:underline"
                          >
                            {company.email}
                          </a>
                        </li>
                      )}
                      {company.employeeCount && (
                        <li>
                          <span className="font-medium text-gray-700">
                            Funcionários:
                          </span>
                          <span className="text-gray-600 ml-2">
                            {company.employeeCount}
                          </span>
                        </li>
                      )}
                      {company.foundedYear && (
                        <li>
                          <span className="font-medium text-gray-700">
                            Fundada em:
                          </span>
                          <span className="text-gray-600 ml-2">
                            {company.foundedYear}
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
