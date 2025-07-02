"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, UserCheck, UserX } from "lucide-react";
import {
  getJobById,
  getApplicationsByJobStage,
  getCandidateData,
  updateApplicationStage,
  type Job,
  type JobApplication,
} from "@/lib/storage";

export default function JobVisualizerPage() {
  const params = useParams();
  const router = useRouter();
  const [jobData, setJobData] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState("");
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [candidates, setCandidates] = useState<Record<string, any>>({});

  useEffect(() => {
    loadJob();
  }, [params.id]);

  useEffect(() => {
    if (jobData && selectedStage) {
      loadApplicationsForStage();
    }
  }, [selectedStage, jobData]);

  const loadJob = () => {
    try {
      const jobId = params.id as string;
      const job = getJobById(jobId);
      if (job) {
        setJobData(job);
        setSelectedStage(job.stages[0] || "");
      }
    } catch (error) {
      console.error("Error loading job:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadApplicationsForStage = () => {
    if (!jobData || !selectedStage) return;

    try {
      const stageApplications = getApplicationsByJobStage(
        jobData.id,
        selectedStage,
      );
      setApplications(stageApplications);

      // Load candidate data for each application
      const candidateData: Record<string, any> = {};
      stageApplications.forEach((app) => {
        const candidate = getCandidateData(app.candidateCpf);
        if (candidate) {
          candidateData[app.candidateCpf] = candidate;
        }
      });
      setCandidates(candidateData);
    } catch (error) {
      console.error("Error loading applications:", error);
    }
  };

  const handleMoveToNextStage = (applicationId: string) => {
    if (!jobData) return;

    const currentIndex = jobData.stages.indexOf(selectedStage);
    const nextStage = jobData.stages[currentIndex + 1];

    if (nextStage) {
      updateApplicationStage(applicationId, nextStage, "approved");
      loadApplicationsForStage(); // Reload applications
    }
  };

  const handleRejectCandidate = (applicationId: string) => {
    updateApplicationStage(applicationId, selectedStage, "rejected");
    loadApplicationsForStage(); // Reload applications
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando vaga...</p>
        </div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Vaga não encontrada.</p>
          <Button onClick={() => router.back()} className="mt-4">
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const currentStageIndex = jobData?.stages.indexOf(selectedStage) || 0;
  const nextStage = jobData?.stages[currentStageIndex + 1];

  const getApplicationStatus = (application: JobApplication) => {
    const currentStageHistory = application.stageHistory.find(
      (h) => h.stage === selectedStage,
    );
    return currentStageHistory?.status || "pending";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStageCount = (stage: string) => {
    if (!jobData) return 0;
    return getApplicationsByJobStage(jobData.id, stage).length;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Visualizar Vaga
            </h1>
            <nav className="flex space-x-2 text-sm text-gray-600 mt-1">
              <span>Vagas</span>
              <span>›</span>
              <span>Detalhes</span>
            </nav>
          </div>
        </div>
        <Button asChild>
          <a href={`/dashboard/company/jobs/edit?id=${params.id}`}>
            Editar Vaga
          </a>
        </Button>
      </div>

      {/* Job Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{jobData.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Área:</span>
              <p className="text-sm">{jobData.area}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Tipo:</span>
              <p className="text-sm">{jobData.contractType}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <Badge
                className={
                  jobData.status === "active"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-red-100 text-red-800 hover:bg-red-100"
                }
              >
                {jobData.status === "active" ? "Ativa" : "Encerrada"}
              </Badge>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">
                Salário:
              </span>
              <p className="text-sm">{jobData.salary}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Modelo:</span>
              <p className="text-sm">{jobData.workModel}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Cidade:</span>
              <p className="text-sm">{jobData.city}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Vagas:</span>
              <p className="text-sm">{jobData.vacancies}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-600">
                Descrição:
              </span>
              <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                {jobData.description}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">
                Requisitos:
              </span>
              <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                {jobData.requirements}
              </p>
            </div>
            {jobData.benefits && (
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Benefícios:
                </span>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                  {jobData.benefits}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selection Process Stages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-600">
            Etapas do Processo Seletivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {jobData.stages.map((stage) => (
              <div
                key={stage}
                onClick={() => setSelectedStage(stage)}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedStage === stage
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-center">
                  <h3 className="font-medium text-sm">{stage}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {getStageCount(stage)} candidatos
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Candidates List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Candidatos: Etapa de {selectedStage}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum candidato nesta etapa.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Nome
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Data da Aplicação
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => {
                    const candidate = candidates[application.candidateCpf];
                    const applicationStatus = getApplicationStatus(application);

                    return (
                      <tr
                        key={application.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium">
                          {candidate?.personal?.fullName ||
                            "Nome não disponível"}
                        </td>
                        <td className="py-3 px-4">
                          {candidate?.personal?.email || "Email não disponível"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(applicationStatus)}>
                            {applicationStatus === "pending"
                              ? "Pendente"
                              : applicationStatus === "approved"
                                ? "Aprovado"
                                : "Rejeitado"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(application.appliedAt).toLocaleDateString(
                            "pt-BR",
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center space-x-1 bg-transparent"
                              asChild
                            >
                              <a
                                href={`/dashboard/candidate/profile?cpf=${application.candidateCpf}`}
                                target="_blank"
                              >
                                <FileText className="w-3 h-3" />
                                <span>Ver Perfil</span>
                              </a>
                            </Button>
                            {nextStage && applicationStatus === "pending" && (
                              <Button
                                size="sm"
                                className="flex items-center space-x-1"
                                onClick={() =>
                                  handleMoveToNextStage(application.id)
                                }
                              >
                                <UserCheck className="w-3 h-3" />
                                <span>Mover para {nextStage}</span>
                              </Button>
                            )}
                            {applicationStatus === "pending" && (
                              <Button
                                variant="destructive"
                                size="sm"
                                className="flex items-center space-x-1"
                                onClick={() =>
                                  handleRejectCandidate(application.id)
                                }
                              >
                                <UserX className="w-3 h-3" />
                                <span>Desclassificar</span>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="text-center mt-4">
            <Button variant="outline" size="sm">
              Mostrar todos os candidatos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
