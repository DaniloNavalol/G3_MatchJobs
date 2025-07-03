"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Building,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Users,
  Trophy,
  FileText,
  User,
} from "lucide-react";
import {
  getCurrentUser,
  getApplicationById,
  getJobById,
  getCompanyData,
  cancelJobApplication,
  type JobApplication,
  type Job,
  type CompanyData,
} from "@/lib/storage";

export default function ApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadApplicationData(params.id as string);
    }
  }, [params.id]);

  const loadApplicationData = (applicationId: string) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser || currentUser.userType !== "candidate") {
        router.push("/auth/login");
        return;
      }

      const applicationData = getApplicationById(applicationId);
      if (!applicationData) {
        router.push("/dashboard/candidate/applications");
        return;
      }

      // Check if application belongs to current user
      const cleanCPF = currentUser.cpfOrCnpj.replace(/\D/g, "");
      if (applicationData.candidateCpf !== cleanCPF) {
        router.push("/dashboard/candidate/applications");
        return;
      }

      setApplication(applicationData);

      // Load job data
      const jobData = getJobById(applicationData.jobId);
      setJob(jobData);

      // Load company data
      if (jobData) {
        const companyData = getCompanyData(jobData.companyCnpj);
        setCompany(companyData);
      }
    } catch (error) {
      console.error("Error loading application:", error);
      router.push("/dashboard/candidate/applications");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelApplication = async () => {
    if (
      !application ||
      !confirm(
        "Tem certeza que deseja cancelar esta candidatura? Esta ação não pode ser desfeita.",
      )
    ) {
      return;
    }

    setCanceling(true);
    try {
      const success = cancelJobApplication(application.id);
      if (success) {
        alert("Candidatura cancelada com sucesso!");
        // Reload the page to show updated status
        loadApplicationData(params.id as string);
      } else {
        alert("Erro ao cancelar candidatura. Tente novamente.");
      }
    } catch (error) {
      console.error("Error canceling application:", error);
      alert("Erro ao cancelar candidatura.");
    } finally {
      setCanceling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return (
          <Badge className="bg-blue-100 text-blue-600">
            Candidatura Enviada
          </Badge>
        );
      case "reviewing":
        return (
          <Badge className="bg-yellow-100 text-yellow-600">Em Análise</Badge>
        );
      case "approved":
        return <Badge className="bg-green-100 text-green-600">Aprovado</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-600">Rejeitado</Badge>;
      case "withdrawn":
        return <Badge className="bg-gray-100 text-gray-600">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStageIcon = (
    stageName: string,
    status: "pending" | "approved" | "rejected",
  ) => {
    const stage = stageName.toLowerCase();

    if (status === "approved") {
      return <CheckCircle className="w-5 h-5 text-white" />;
    } else if (status === "rejected") {
      return <XCircle className="w-5 h-5 text-white" />;
    } else if (status === "pending") {
      if (stage.includes("triagem")) {
        return <FileText className="w-5 h-5 text-white" />;
      } else if (stage.includes("teste") || stage.includes("técnico")) {
        return <AlertCircle className="w-5 h-5 text-white" />;
      } else if (stage.includes("entrevista")) {
        return <Users className="w-5 h-5 text-white" />;
      } else if (stage.includes("final")) {
        return <Trophy className="w-5 h-5 text-white" />;
      } else {
        return <Clock className="w-5 h-5 text-white" />;
      }
    }
    return <Clock className="w-5 h-5 text-white" />;
  };

  const getStageBadgeColor = (
    stageName: string,
    status: "pending" | "approved" | "rejected",
    isCurrent: boolean,
  ) => {
    if (status === "approved") return "bg-green-500";
    if (status === "rejected") return "bg-red-500";
    if (isCurrent) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const getStageStatusBadge = (
    status: "pending" | "approved" | "rejected",
    isCurrent: boolean,
  ) => {
    if (status === "approved") {
      return <Badge className="bg-green-100 text-green-600">Concluído</Badge>;
    } else if (status === "rejected") {
      return <Badge className="bg-red-100 text-red-600">Rejeitado</Badge>;
    } else if (isCurrent) {
      return (
        <Badge className="bg-yellow-100 text-yellow-600">Em andamento</Badge>
      );
    } else {
      return <Badge className="bg-gray-100 text-gray-600">Pendente</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Carregando detalhes da candidatura...
          </p>
        </div>
      </div>
    );
  }

  if (!application || !job) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Candidatura não encontrada
          </h1>
          <p className="text-gray-600 mb-6">
            A candidatura que você está procurando não existe.
          </p>
          <Link href="/dashboard/candidate/applications">
            <Button>Voltar para Candidaturas</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/candidate/applications">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detalhes da Candidatura
            </h1>
            <nav className="flex space-x-2 text-sm text-gray-600 mt-2">
              <span>Dashboard</span>
              <span>›</span>
              <Link
                href="/dashboard/candidate/applications"
                className="hover:underline"
              >
                Minhas Candidaturas
              </Link>
              <span>›</span>
              <span>Detalhes</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Job Information */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {job.title}
              </h3>
              <div className="space-y-1 text-gray-600">
                <p>
                  <strong>Empresa:</strong>{" "}
                  {company?.name || "Empresa não encontrada"}
                </p>
                <p>
                  <strong>Local:</strong> {job.city}
                  {company?.state ? `, ${company.state}` : ""}
                </p>
                <p>
                  <strong>Modelo de Trabalho:</strong> {job.workModel}
                </p>
                <p>
                  <strong>Tipo de Contrato:</strong> {job.contractType}
                </p>
                {job.salary && (
                  <p>
                    <strong>Salário:</strong>{" "}
                    <span className="text-green-600 font-semibold">
                      {job.salary}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <div className="space-y-4">
            <div>
              <h5 className="font-semibold mb-2">Descrição da Vaga</h5>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {job.requirements && (
              <div>
                <h5 className="font-semibold mb-2">Requisitos</h5>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {job.requirements}
                </div>
              </div>
            )}

            {job.benefits && (
              <div>
                <h5 className="font-semibold mb-2">Benefícios</h5>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {job.benefits}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Process Timeline */}
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-700">
            Etapas do Processo Seletivo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-8">
            {application.stageHistory.map((stage, index) => {
              const isLast = index === application.stageHistory.length - 1;
              const isCurrent = stage.stage === application.currentStage;

              return (
                <div key={index} className="relative flex items-start">
                  {/* Timeline line */}
                  {!isLast && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                  )}

                  {/* Stage icon */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getStageBadgeColor(stage.stage, stage.status, isCurrent)}`}
                  >
                    {getStageIcon(stage.stage, stage.status)}
                  </div>

                  {/* Stage content */}
                  <div className="ml-6 flex-1">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-gray-900">
                          {stage.stage}
                        </h5>
                        {getStageStatusBadge(stage.status, isCurrent)}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <strong>Status:</strong>{" "}
                          {stage.status === "approved"
                            ? "Aprovado"
                            : stage.status === "rejected"
                              ? "Rejeitado"
                              : "Pendente"}
                        </p>
                        <p>
                          <strong>Data:</strong> {formatDateTime(stage.date)}
                        </p>
                        {stage.notes && (
                          <p>
                            <strong>Observações:</strong> {stage.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Application Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Data de Inscrição:</strong>
                  </p>
                  <p className="font-medium">
                    {formatDate(application.appliedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Status Atual:</strong>
                  </p>
                  <div className="mt-1">
                    {getStatusBadge(application.status)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Etapa Atual:</strong>
                  </p>
                  <p className="font-medium">{application.currentStage}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/jobs/${job.id}`}>
                <Button variant="outline">Ver Vaga Original</Button>
              </Link>
              {(application.status === "applied" ||
                application.status === "reviewing") &&
              application.status !== "withdrawn" ? (
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleCancelApplication}
                  disabled={canceling}
                >
                  {canceling ? "Cancelando..." : "Cancelar Candidatura"}
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
