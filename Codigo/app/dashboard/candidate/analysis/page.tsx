"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, RefreshCw, TrendingUp, Target, Lightbulb } from "lucide-react";
import Link from "next/link";
import { getCurrentUserData, type CandidateData } from "@/lib/storage";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

export default function CandidateAnalysis() {
  const [candidateData, setCandidateData] = useState<CandidateData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCandidateData = () => {
      const data = getCurrentUserData();
      setCandidateData(data);
      setLoading(false);
    };

    loadCandidateData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando análise...</p>
        </div>
      </div>
    );
  }

  const behavioralData = candidateData?.behavioralAnalysis;
  const insights = behavioralData?.aiInsights;

  if (!behavioralData || !insights) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Análise Comportamental
          </h1>
          <nav className="flex space-x-2 text-sm text-gray-600 mt-2">
            <span>Candidato</span>
            <span>›</span>
            <span>Análise Comportamental</span>
          </nav>
        </div>

        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Análise Não Realizada
          </h2>
          <p className="text-gray-600 mb-6">
            Complete a análise comportamental para ver seus insights
            personalizados.
          </p>
          <Link href="/dashboard/candidate/analysis/edit">
            <Button size="lg">
              <Brain className="w-5 h-5 mr-2" />
              Fazer Análise Comportamental
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Análise Comportamental
        </h1>
        <nav className="flex space-x-2 text-sm text-gray-600 mt-2">
          <span>Candidato</span>
          <span>›</span>
          <span>Análise Comportamental</span>
        </nav>
      </div>

      {/* Main Profile Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {insights.enneagramType
                    ? `Eneagrama: Tipo ${insights.enneagramType.type} - ${insights.enneagramType.name}`
                    : "Perfil Comportamental"}
                </h2>
                <p className="text-blue-100">{insights.profileSummary}</p>
              </div>
            </div>
            <Badge className="bg-white text-blue-600 px-4 py-2">
              {insights.enneagramType?.description ||
                "Análise Comportamental Completa"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Profile Description */}
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-800 flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            {insights.enneagramType
              ? `Perfil Eneagrama - Tipo ${insights.enneagramType.type}`
              : "Perfil Comportamental Completo"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {insights.enneagramType && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <h4 className="font-semibold text-blue-800 mb-1">
                Tipo {insights.enneagramType.type} -{" "}
                {insights.enneagramType.name}
              </h4>
              <p className="text-sm text-blue-700">
                {insights.enneagramType.description}
              </p>
            </div>
          )}
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {insights.profile}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Radar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Big Five Radar Chart */}
        <Card>
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-800 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Gráfico de Radar - Big Five
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  data={[
                    {
                      trait: "Abertura",
                      value: insights.bigFiveDistribution.openness,
                      fullMark: 100,
                    },
                    {
                      trait: "Conscienciosidade",
                      value: insights.bigFiveDistribution.conscientiousness,
                      fullMark: 100,
                    },
                    {
                      trait: "Extroversão",
                      value: insights.bigFiveDistribution.extraversion,
                      fullMark: 100,
                    },
                    {
                      trait: "Amabilidade",
                      value: insights.bigFiveDistribution.agreeableness,
                      fullMark: 100,
                    },
                    {
                      trait: "Estabilidade Emocional",
                      value: 100 - insights.bigFiveDistribution.neuroticism,
                      fullMark: 100,
                    },
                  ]}
                  margin={{
                    top: 20,
                    right: 30,
                    bottom: 20,
                    left: 30,
                  }}
                >
                  <PolarGrid />
                  <PolarAngleAxis
                    dataKey="trait"
                    tick={{ fontSize: 12, fill: "#374151" }}
                    className="text-sm"
                  />
                  <PolarRadiusAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: "#6B7280" }}
                    axisLine={false}
                  />
                  <Radar
                    name="Big Five"
                    dataKey="value"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0];
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-medium text-gray-900">
                              {data.payload.trait}
                            </p>
                            <p className="text-green-600">
                              <span className="font-bold">{data.value}%</span>
                              <span className="text-gray-500 ml-2">
                                (
                                {data.value >= 70
                                  ? "Alto"
                                  : data.value >= 40
                                    ? "Moderado"
                                    : "Baixo"}
                                )
                              </span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Behavioral Highlights Radar Chart */}
        <Card>
          <CardHeader className="bg-yellow-50">
            <CardTitle className="text-yellow-800 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Gráfico de Radar - Destaques Comportamentais
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  data={[
                    {
                      trait: "Colaboração",
                      value: 85, // Valor fixo por enquanto, depois pode ser calculado baseado na análise
                      fullMark: 100,
                    },
                    {
                      trait: "Resolução de Problemas",
                      value: 78,
                      fullMark: 100,
                    },
                    {
                      trait: "Proatividade",
                      value: 82,
                      fullMark: 100,
                    },
                    {
                      trait: "Comunicação",
                      value: 88,
                      fullMark: 100,
                    },
                    {
                      trait: "Adaptabilidade",
                      value: 75,
                      fullMark: 100,
                    },
                    {
                      trait: "Liderança",
                      value: 70,
                      fullMark: 100,
                    },
                    {
                      trait: "Int. Emocional",
                      value: 90,
                      fullMark: 100,
                    },
                  ]}
                  margin={{
                    top: 20,
                    right: 30,
                    bottom: 20,
                    left: 30,
                  }}
                >
                  <PolarGrid />
                  <PolarAngleAxis
                    dataKey="trait"
                    tick={{ fontSize: 11, fill: "#374151" }}
                    className="text-xs"
                  />
                  <PolarRadiusAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: "#6B7280" }}
                    axisLine={false}
                  />
                  <Radar
                    name="Destaques"
                    dataKey="value"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0];
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-medium text-gray-900">
                              {data.payload.trait}
                            </p>
                            <p className="text-yellow-600">
                              <span className="font-bold">{data.value}%</span>
                              <span className="text-gray-500 ml-2">
                                (
                                {data.value >= 70
                                  ? "Alto"
                                  : data.value >= 40
                                    ? "Moderado"
                                    : "Baixo"}
                                )
                              </span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recommended Positions */}
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800 flex items-center text-base">
              <Target className="w-4 h-4 mr-2" />
              Posições Recomendadas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {insights.suggestions.recommendedPositions.map(
                (position, index) => (
                  <Badge
                    key={`position-${index}`}
                    variant="secondary"
                    className="block text-center py-2 text-xs"
                  >
                    {position}
                  </Badge>
                ),
              )}
            </div>
          </CardContent>
        </Card>

        {/* Standout Tips */}
        <Card>
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-800 flex items-center text-base">
              <Lightbulb className="w-4 h-4 mr-2" />
              Dicas para se Destacar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {insights.suggestions.standoutTips.map((tip, index) => (
                <div
                  key={`tip-${index}`}
                  className="bg-green-50 border border-green-200 rounded p-2"
                >
                  <p className="text-xs text-green-800">• {tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Development Areas */}
        <Card>
          <CardHeader className="bg-orange-50">
            <CardTitle className="text-orange-800 flex items-center text-base">
              <TrendingUp className="w-4 h-4 mr-2" />
              Áreas de Desenvolvimento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {insights.suggestions.developmentAreas.map((area, index) => (
                <div
                  key={`area-${index}`}
                  className="bg-orange-50 border border-orange-200 rounded p-2"
                >
                  <p className="text-xs text-orange-800">• {area}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completion Info */}
      {behavioralData.completedAt && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Análise realizada em:{" "}
                  {new Date(behavioralData.completedAt).toLocaleDateString(
                    "pt-BR",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </p>
              </div>
              <Link href="/dashboard/candidate/analysis/edit">
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refazer Análise
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
