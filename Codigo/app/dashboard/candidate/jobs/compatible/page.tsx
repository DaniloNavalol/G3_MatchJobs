"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Building,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";
import {
  getCurrentUser,
  getCompatibleJobs,
  type JobCompatibility,
} from "@/lib/storage";

export default function CompatibleJobsPage() {
  const router = useRouter();
  const [compatibleJobs, setCompatibleJobs] = useState<JobCompatibility[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "Alta" | "Média" | "Baixa">(
    "all",
  );

  useEffect(() => {
    loadCompatibleJobs();
  }, []);

  const loadCompatibleJobs = () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser || currentUser.userType !== "candidate") {
        router.push("/auth/login");
        return;
      }

      const jobs = getCompatibleJobs(currentUser.cpfOrCnpj);
      setCompatibleJobs(jobs);
    } catch (error) {
      console.error("Error loading compatible jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCompatibilityColor = (level: string) => {
    switch (level) {
      case "Alta":
        return "bg-green-100 text-green-800 border-green-200";
      case "Média":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Baixa":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredJobs =
    filter === "all"
      ? compatibleJobs
      : compatibleJobs.filter((job) => job.compatibilityLevel === filter);

  const getStats = () => {
    const total = compatibleJobs.length;
    const alta = compatibleJobs.filter(
      (job) => job.compatibilityLevel === "Alta",
    ).length;
    const media = compatibleJobs.filter(
      (job) => job.compatibilityLevel === "Média",
    ).length;
    const baixa = compatibleJobs.filter(
      (job) => job.compatibilityLevel === "Baixa",
    ).length;

    return { total, alta, media, baixa };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analisando compatibilidade...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vagas Compatíveis</h1>
        <nav className="flex space-x-2 text-sm text-gray-600 mt-2">
          <span>Dashboard</span>
          <span>›</span>
          <span>Vagas</span>
          <span>›</span>
          <span>Compatíveis</span>
        </nav>
        <p className="text-gray-600 mt-2">
          Vagas analisadas com base no seu perfil e experiências
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total de Vagas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {stats.alta}
            </div>
            <div className="text-sm text-gray-600">Alta Compatibilidade</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.media}
            </div>
            <div className="text-sm text-gray-600">Média Compatibilidade</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.baixa}</div>
            <div className="text-sm text-gray-600">Baixa Compatibilidade</div>
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
          variant={filter === "Alta" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("Alta")}
          className={filter === "Alta" ? "bg-green-600 hover:bg-green-700" : ""}
        >
          Alta ({stats.alta})
        </Button>
        <Button
          variant={filter === "Média" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("Média")}
          className={
            filter === "Média" ? "bg-yellow-600 hover:bg-yellow-700" : ""
          }
        >
          Média ({stats.media})
        </Button>
        <Button
          variant={filter === "Baixa" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("Baixa")}
          className={filter === "Baixa" ? "bg-red-600 hover:bg-red-700" : ""}
        >
          Baixa ({stats.baixa})
        </Button>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === "all"
                ? "Nenhuma vaga compatível encontrada"
                : `Nenhuma vaga com compatibilidade ${filter.toLowerCase()}`}
            </h3>
            <p className="text-gray-600 mb-4">
              {filter === "all"
                ? "Complete seu perfil para obter recomendações mais precisas."
                : "Ajuste os filtros para ver outras vagas."}
            </p>
            {filter === "all" && (
              <Link href="/dashboard/candidate/profile/edit">
                <Button>Completar Perfil</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((jobCompatibility) => (
            <Card
              key={jobCompatibility.jobId}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Company Logo */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {jobCompatibility.company?.logo ? (
                        <img
                          src={jobCompatibility.company.logo}
                          alt={jobCompatibility.company.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Building className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Job Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {jobCompatibility.job.title}
                          </h3>
                          <p className="text-gray-600 mb-2 font-medium">
                            {jobCompatibility.company?.name ||
                              "Empresa não encontrada"}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={`${getCompatibilityColor(jobCompatibility.compatibilityLevel)} border`}
                          >
                            {jobCompatibility.compatibilityLevel}{" "}
                            Compatibilidade
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {jobCompatibility.job.city}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {jobCompatibility.job.workModel}
                        </div>
                        <Badge variant="outline">
                          {jobCompatibility.job.contractType}
                        </Badge>
                        <Badge variant="outline">
                          {jobCompatibility.job.area}
                        </Badge>
                      </div>

                      {/* Compatibility Score */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            Score de Compatibilidade
                          </span>
                          <span
                            className={`text-sm font-bold ${getScoreColor(jobCompatibility.compatibilityScore)}`}
                          >
                            {jobCompatibility.compatibilityScore}%
                          </span>
                        </div>
                        <Progress
                          value={jobCompatibility.compatibilityScore}
                          className="h-2"
                        />
                      </div>

                      {/* Compatibility Reasons */}
                      {jobCompatibility.reasons.length > 0 && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-700 mb-1 block">
                            Por que é compatível:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {jobCompatibility.reasons.map((reason, index) => (
                              <Badge
                                key={`reason-${jobCompatibility.jobId}-${index}`}
                                variant="secondary"
                                className="text-xs"
                              >
                                {reason}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Job Description Preview */}
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {jobCompatibility.job.description.substring(0, 150)}...
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    <Link href={`/jobs/${jobCompatibility.job.id}`}>
                      <Button size="sm" className="w-full">
                        Ver Detalhes
                      </Button>
                    </Link>
                    <Link href={`/jobs/${jobCompatibility.job.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Candidatar-se
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tips for better compatibility */}
      {compatibleJobs.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Dicas para Melhorar sua Compatibilidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-blue-700">
              <li>• Complete todas as seções do seu perfil</li>
              <li>• Adicione mais habilidades técnicas relevantes</li>
              <li>• Mantenha suas experiências profissionais atualizadas</li>
              <li>• Inclua cursos e certificações na sua área</li>
            </ul>
            <div className="mt-4">
              <Link href="/dashboard/candidate/profile/edit">
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  Editar Perfil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
