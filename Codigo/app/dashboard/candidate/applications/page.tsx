"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building,
  MapPin,
  Calendar,
  Clock,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  getCurrentUser,
  getApplicationsByCandidateCpf,
  getJobById,
  getCompanyData,
  type JobApplication,
  type Job,
  type CompanyData,
} from "@/lib/storage";

interface ApplicationWithDetails extends JobApplication {
  job: Job | null;
  company: CompanyData | null;
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationWithDetails[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "applied" | "reviewing" | "approved" | "rejected"
  >("all");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser || currentUser.userType !== "candidate") {
        router.push("/auth/login");
        return;
      }

      const userApplications = getApplicationsByCandidateCpf(
        currentUser.cpfOrCnpj,
      );

      // Enrich applications with job and company data
      const enrichedApplications: ApplicationWithDetails[] =
        userApplications.map((app) => {
          const job = getJobById(app.jobId);
          const company = job ? getCompanyData(job.companyCnpj) : null;

          return {
            ...app,
            job,
            company,
          };
        });

      // Sort by application date (most recent first)
      enrichedApplications.sort(
        (a, b) =>
          new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
      );

      setApplications(enrichedApplications);
    } catch (error) {
      console.error("Error loading applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-600">
            Candidatura Enviada
          </Badge>
        );
      case "reviewing":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-600">
            Em Análise
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-600">
            Aprovado
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-600">
            Rejeitado
          </Badge>
        );
      case "withdrawn":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
            Cancelado
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "reviewing":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredApplications =
    filter === "all"
      ? applications
      : applications.filter((app) => app.status === filter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getApplicationStats = () => {
    const total = applications.length;
    const applied = applications.filter(
      (app) => app.status === "applied",
    ).length;
    const reviewing = applications.filter(
      (app) => app.status === "reviewing",
    ).length;
    const approved = applications.filter(
      (app) => app.status === "approved",
    ).length;
    const rejected = applications.filter(
      (app) => app.status === "rejected",
    ).length;

    return { total, applied, reviewing, approved, rejected };
  };

  const stats = getApplicationStats();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando candidaturas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Minhas Candidaturas
        </h1>
        <nav className="flex space-x-2 text-sm text-gray-600 mt-2">
          <span>Dashboard</span>
          <span>›</span>
          <span>Candidaturas</span>
        </nav>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.applied}
            </div>
            <div className="text-sm text-gray-600">Enviadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.reviewing}
            </div>
            <div className="text-sm text-gray-600">Em Análise</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
            <div className="text-sm text-gray-600">Aprovadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </div>
            <div className="text-sm text-gray-600">Rejeitadas</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          Todas ({stats.total})
        </Button>
        <Button
          variant={filter === "applied" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("applied")}
        >
          Enviadas ({stats.applied})
        </Button>
        <Button
          variant={filter === "reviewing" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("reviewing")}
        >
          Em Análise ({stats.reviewing})
        </Button>
        <Button
          variant={filter === "approved" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("approved")}
        >
          Aprovadas ({stats.approved})
        </Button>
        <Button
          variant={filter === "rejected" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("rejected")}
        >
          Rejeitadas ({stats.rejected})
        </Button>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === "all"
                ? "Nenhuma candidatura ainda"
                : `Nenhuma candidatura ${filter === "applied" ? "enviada" : filter === "reviewing" ? "em análise" : filter === "approved" ? "aprovada" : "rejeitada"}`}
            </h3>
            <p className="text-gray-600 mb-4">
              {filter === "all"
                ? "Quando você se candidatar a vagas, elas aparecerão aqui."
                : "Ajuste os filtros para ver outras candidaturas."}
            </p>
            {filter === "all" && (
              <Link href="/jobs">
                <Button>Buscar Vagas</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card
              key={application.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Company Logo */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {application.company?.logo ? (
                        <img
                          src={application.company.logo}
                          alt={application.company.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Building className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Job Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {application.job?.title || "Vaga não encontrada"}
                          </h3>
                          <p className="text-gray-600 mb-2 font-medium">
                            {application.company?.name ||
                              "Empresa não encontrada"}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {application.job?.city || "Local não informado"}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Candidatura: {formatDate(application.appliedAt)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            {getStatusIcon(application.status)}
                            {getStatusBadge(application.status)}
                            {application.job && (
                              <Badge variant="outline">
                                {application.job.workModel}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Etapa atual:</strong>{" "}
                            {application.currentStage}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/dashboard/candidate/applications/${application.id}`}
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </Link>
                    {application.job && (
                      <Link href={`/jobs/${application.job.id}`}>
                        <Button variant="ghost" size="sm" className="w-full">
                          Ver Vaga
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
