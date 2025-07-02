"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Briefcase,
  TrendingUp,
  Eye,
  Mail,
  Phone,
  MapPin,
  Edit,
  Share2,
  Linkedin,
  Github,
  Twitter,
} from "lucide-react";
import {
  getCurrentUserData,
  getCurrentUserCPF,
  getCandidateStatistics,
  getRecentApplications,
  getJobById,
  type CandidateData,
  type JobApplication,
} from "@/lib/storage";

export default function CandidateDashboard() {
  const [activeTab, setActiveTab] = useState("about");
  const [candidateData, setCandidateData] = useState<CandidateData | null>(
    null,
  );
  const [statistics, setStatistics] = useState({
    applications: 0,
    interviews: 0,
    profileViews: 0,
    matchRate: 0,
  });
  const [recentApplications, setRecentApplications] = useState<
    JobApplication[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCandidateData = () => {
      const data = getCurrentUserData();
      setCandidateData(data);

      if (data?.personal?.cpf) {
        const stats = getCandidateStatistics(data.personal.cpf);
        setStatistics(stats);

        const applications = getRecentApplications(data.personal.cpf, 5);
        setRecentApplications(applications);
      }

      setLoading(false);
    };

    loadCandidateData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard do Candidato
        </h1>
        <nav className="flex space-x-2 text-sm text-gray-600 mt-2">
          <span>Dashboard</span>
          <span>›</span>
          <span>Visão Geral</span>
        </nav>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Candidaturas
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.applications}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Entrevistas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.interviews}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Perfil Visto
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.profileViews}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Taxa de Match
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.matchRate}%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Section */}
      {candidateData ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <div className="h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg"></div>
              <CardContent className="p-6 text-center -mt-10">
                <div className="relative inline-block">
                  <Image
                    src="/assets/img/sauro.jpg"
                    alt={candidateData.personal.fullName}
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-white shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-4">
                  {candidateData.personal.fullName || "Nome não informado"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {candidateData.experiences.length > 0
                    ? candidateData.experiences[0].title
                    : "Profissional"}
                </p>

                <div className="space-y-3 text-left">
                  {candidateData.personal.email && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span>{candidateData.personal.email}</span>
                    </div>
                  )}
                  {candidateData.personal.phone && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span>{candidateData.personal.phone}</span>
                    </div>
                  )}
                  {(candidateData.personal.city ||
                    candidateData.personal.state) && (
                    <div className="flex items-center space-x-3 text-sm">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>
                        {[
                          candidateData.personal.city,
                          candidateData.personal.state,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-2 bg-transparent"
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-2 bg-transparent"
                  >
                    <Github className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-2 bg-transparent"
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex space-x-2 mt-6">
                  <Link
                    href="/dashboard/candidate/profile/edit"
                    className="flex-1"
                  >
                    <Button size="sm" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Perfil
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="about">Sobre</TabsTrigger>
                    <TabsTrigger value="experience">Experiência</TabsTrigger>
                    <TabsTrigger value="behavior">
                      Perfil Comportamental
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>

              <CardContent>
                <Tabs value={activeTab}>
                  {/* About Tab */}
                  <TabsContent value="about" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Resumo Profissional
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {candidateData.personal.about ||
                          "Nenhuma descrição pessoal adicionada ainda."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Education */}
                      <div>
                        <h4 className="font-semibold mb-3">Educação</h4>
                        <div className="space-y-4">
                          {candidateData.education.length > 0 ? (
                            candidateData.education.slice(0, 2).map((edu) => (
                              <div key={edu.id}>
                                <h5 className="font-medium">{edu.degree}</h5>
                                <p className="text-sm text-gray-600">
                                  {edu.institution}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {edu.completionYear}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">
                              Nenhuma formação acadêmica adicionada.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Languages */}
                      <div>
                        <h4 className="font-semibold mb-3">Idiomas</h4>
                        <div className="space-y-3">
                          {candidateData.languages.length > 0 ? (
                            candidateData.languages
                              .slice(0, 2)
                              .map((language) => (
                                <div key={language.id}>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">
                                      {language.name}
                                    </span>
                                    <span className="text-sm">
                                      {language.level}
                                    </span>
                                  </div>
                                  <Progress
                                    value={language.proficiency}
                                    className="h-2"
                                  />
                                </div>
                              ))
                          ) : (
                            <p className="text-sm text-gray-500">
                              Nenhum idioma adicionado.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Technical Skills */}
                      <div>
                        <h4 className="font-semibold mb-3">Habilidades</h4>
                        <div className="flex flex-wrap gap-2">
                          {candidateData.skills.technical.length > 0 ? (
                            candidateData.skills.technical
                              .slice(0, 6)
                              .map((skill) => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))
                          ) : (
                            <p className="text-sm text-gray-500">
                              Nenhuma habilidade adicionada.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Knowledge Skills */}
                      <div>
                        <h4 className="font-semibold mb-3">Conhecimentos</h4>
                        <div className="flex flex-wrap gap-2">
                          {candidateData.skills.soft.length > 0 ? (
                            candidateData.skills.soft
                              .slice(0, 6)
                              .map((knowledge) => (
                                <Badge key={knowledge} variant="outline">
                                  {knowledge}
                                </Badge>
                              ))
                          ) : (
                            <p className="text-sm text-gray-500">
                              Nenhum conhecimento adicionado.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Experience Tab */}
                  <TabsContent value="experience" className="space-y-6">
                    <h3 className="text-lg font-semibold">
                      Experiência Profissional
                    </h3>
                    <div className="space-y-6">
                      {candidateData.experiences.length > 0 ? (
                        candidateData.experiences
                          .slice(0, 3)
                          .map((experience, index) => (
                            <div
                              key={experience.id}
                              className={`border-l-4 ${
                                index === 0
                                  ? "border-blue-500"
                                  : index === 1
                                    ? "border-gray-400"
                                    : "border-gray-300"
                              } pl-4`}
                            >
                              <h4
                                className={`font-semibold ${
                                  index === 0
                                    ? "text-blue-600"
                                    : index === 1
                                      ? "text-gray-600"
                                      : "text-gray-500"
                                }`}
                              >
                                {experience.title}
                              </h4>
                              <p className="font-medium">
                                {experience.company}
                              </p>
                              <p className="text-sm text-gray-500 mb-2">
                                {experience.startDate} -{" "}
                                {experience.isCurrent
                                  ? "Presente"
                                  : experience.endDate}
                              </p>
                              {experience.description && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {experience.description}
                                </p>
                              )}
                            </div>
                          ))
                      ) : (
                        <p className="text-gray-500">
                          Nenhuma experiência profissional adicionada ainda.
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  {/* Behavior Tab */}
                  <TabsContent value="behavior" className="space-y-6">
                    <h3 className="text-lg font-semibold">
                      Resumo Comportamental
                    </h3>

                    {candidateData.behavioralAnalysis?.aiInsights ? (
                      <div className="space-y-6">
                        {/* Profile Summary */}
                        <div>
                          <h4 className="font-semibold mb-3">
                            Resumo do Perfil
                          </h4>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800 font-medium leading-relaxed">
                              {
                                candidateData.behavioralAnalysis.aiInsights
                                  .profileSummary
                              }
                            </p>
                          </div>
                        </div>

                        {/* Big Five Summary */}
                        <div>
                          <h4 className="font-semibold mb-3">
                            Principais Traços (Big Five)
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(
                              candidateData.behavioralAnalysis.aiInsights
                                .bigFiveDistribution,
                            )
                              .sort(([, a], [, b]) => b - a)
                              .slice(0, 4)
                              .map(([trait, value]) => (
                                <div
                                  key={trait}
                                  className="bg-gray-50 rounded p-3"
                                >
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">
                                      {trait === "openness"
                                        ? "Abertura"
                                        : trait === "conscientiousness"
                                          ? "Conscienciosidade"
                                          : trait === "extraversion"
                                            ? "Extroversão"
                                            : trait === "agreeableness"
                                              ? "Amabilidade"
                                              : "Neuroticismo"}
                                    </span>
                                    <span className="text-sm font-bold text-blue-600">
                                      {value}%
                                    </span>
                                  </div>
                                  <Progress value={value} className="h-2" />
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Link to full analysis */}
                        <div className="text-center">
                          <Link href="/dashboard/candidate/analysis">
                            <Button variant="outline">
                              Ver Análise Completa
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ) : candidateData.behavioralAnalysis ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">
                          Análise completada, mas insights ainda não foram
                          gerados.
                        </p>
                        <Button variant="outline">Gerar Insights com IA</Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">
                          Análise comportamental não realizada ainda.
                        </p>
                        <Link href="/dashboard/candidate/analysis/edit">
                          <Button>Fazer Análise Comportamental</Button>
                        </Link>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Perfil Não Encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            Complete seu cadastro para visualizar seu perfil.
          </p>
          <Link href="/dashboard/candidate/profile/edit">
            <Button size="lg">Completar Cadastro</Button>
          </Link>
        </div>
      )}

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Candidaturas Recentes</CardTitle>
            <Badge variant="secondary">
              {recentApplications.length} candidaturas
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentApplications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma candidatura ainda.</p>
                <p className="text-sm">Comece a se candidatar para vagas!</p>
              </div>
            ) : (
              recentApplications.map((application) => {
                const job = getJobById(application.jobId);
                const getStatusInfo = (
                  status: string,
                  currentStage: string,
                ) => {
                  switch (status) {
                    case "applied":
                      return {
                        text: "Candidatura enviada",
                        color: "bg-blue-100 text-blue-800",
                      };
                    case "reviewing":
                      return {
                        text: currentStage || "Em análise",
                        color: "bg-yellow-100 text-yellow-800",
                      };
                    case "approved":
                      return {
                        text: "Aprovado",
                        color: "bg-green-100 text-green-800",
                      };
                    case "rejected":
                      return {
                        text: "Não selecionado",
                        color: "bg-red-100 text-red-800",
                      };
                    default:
                      return {
                        text: "Em processo",
                        color: "bg-gray-100 text-gray-800",
                      };
                  }
                };
                const statusInfo = getStatusInfo(
                  application.status,
                  application.currentStage,
                );

                return (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {job?.title || "Vaga não encontrada"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {job?.area || "Área não informada"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Aplicado em:{" "}
                        {new Date(application.appliedAt).toLocaleDateString(
                          "pt-BR",
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={statusInfo.color}>
                        {statusInfo.text}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline">Ver todas as candidaturas</Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Completar Perfil
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Aumente suas chances com um perfil completo
            </p>
            <Link href="/dashboard/candidate/profile/edit">
              <Button className="w-full">Editar Perfil</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Vagas Compatíveis
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Encontre vagas que combinam com você
            </p>
            <Link href="/dashboard/candidate/jobs/compatible">
              <Button className="w-full">Ver Vagas</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Análise Comportamental
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Descubra seu perfil profissional
            </p>
            <Link href="/dashboard/candidate/analysis">
              <Button className="w-full">Ver Análise</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
