"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  Building,
  MapPin,
  Calendar,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getCurrentCompanyData,
  getActiveJobsByCompany,
  getClosedJobsByCompany,
  getCurrentCompanyCNPJ,
  type CompanyData,
} from "@/lib/storage";

export default function CompanyDashboard() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [activeJobs, setActiveJobs] = useState(0);
  const [closedJobs, setClosedJobs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompanyData = () => {
      const data = getCurrentCompanyData();
      setCompanyData(data);

      if (data) {
        const currentCNPJ = getCurrentCompanyCNPJ();
        if (currentCNPJ) {
          const activeJobsList = getActiveJobsByCompany(currentCNPJ);
          const closedJobsList = getClosedJobsByCompany(currentCNPJ);
          setActiveJobs(activeJobsList.length);
          setClosedJobs(closedJobsList.length);
        }
      }

      setLoading(false);
    };

    loadCompanyData();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      // Simple chart implementation using canvas
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);

        // Draw simple line chart
        ctx.strokeStyle = "#007bff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, 100);
        ctx.lineTo(100, 80);
        ctx.lineTo(150, 90);
        ctx.lineTo(200, 70);
        ctx.lineTo(250, 60);
        ctx.lineTo(300, 75);
        ctx.stroke();

        // Draw second line
        ctx.strokeStyle = "#28a745";
        ctx.beginPath();
        ctx.moveTo(50, 120);
        ctx.lineTo(100, 110);
        ctx.lineTo(150, 100);
        ctx.lineTo(200, 95);
        ctx.lineTo(250, 85);
        ctx.lineTo(300, 90);
        ctx.stroke();
      }
    }
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

  if (!companyData) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard da Empresa
          </h1>
          <nav className="flex space-x-2 text-sm text-gray-600 mt-2">
            <span>Dashboard</span>
          </nav>
        </div>

        <div className="text-center py-12">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Perfil da Empresa Não Encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            Complete o cadastro da sua empresa para acessar o dashboard.
          </p>
          <Link href="/dashboard/company/profile/edit">
            <Button size="lg">
              <Building className="w-5 h-5 mr-2" />
              Completar Cadastro
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
          Dashboard da Empresa
        </h1>
        <nav className="flex space-x-2 text-sm text-gray-600 mt-2">
          <span>Dashboard</span>
          <span>›</span>
          <span>{companyData.name}</span>
        </nav>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Vagas Abertas
                </p>
                <p className="text-2xl font-bold text-gray-900">{activeJobs}</p>
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
                <p className="text-sm font-medium text-gray-600">
                  Candidatos Ativos
                </p>
                <p className="text-2xl font-bold text-gray-900">87</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processos</p>
                <p className="text-2xl font-bold text-gray-900">
                  5 em andamento
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Vagas Encerradas
                </p>
                <p className="text-2xl font-bold text-gray-900">{closedJobs}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Informações da Empresa</CardTitle>
              <Link href="/dashboard/company/profile/edit">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-semibold">{companyData.name}</p>
                  <p className="text-sm text-gray-600">
                    CNPJ: {companyData.cnpj}
                  </p>
                </div>
              </div>

              {(companyData.city || companyData.state) && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-semibold">
                      {[companyData.city, companyData.state]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {companyData.address && (
                      <p className="text-sm text-gray-600">
                        {companyData.address}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {companyData.employeeCount && (
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-semibold">
                      {companyData.employeeCount} funcionários
                    </p>
                    <p className="text-sm text-gray-600">
                      {companyData.industry}
                    </p>
                  </div>
                </div>
              )}

              {companyData.foundedYear && (
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-semibold">
                      Fundada em {companyData.foundedYear}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date().getFullYear() -
                        parseInt(companyData.foundedYear)}{" "}
                      anos de mercado
                    </p>
                  </div>
                </div>
              )}

              {companyData.about && (
                <div className="pt-4">
                  <h4 className="font-medium mb-2">Sobre a Empresa</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {companyData.about}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/company/profile/edit">
                <Button className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Perfil da Empresa
                </Button>
              </Link>
              <Link href="/dashboard/company/jobs/edit">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Cadastrar Nova Vaga
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <Users className="w-4 h-4 mr-2" />
                Gerenciar Usuários
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Vagas Ativas</span>
                <span className="font-semibold">{activeJobs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vagas Encerradas</span>
                <span className="font-semibold">{closedJobs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total de Vagas</span>
                <span className="font-semibold">{activeJobs + closedJobs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxa de Sucesso</span>
                <span className="font-semibold text-green-600">
                  {activeJobs + closedJobs > 0
                    ? Math.round((closedJobs / (activeJobs + closedJobs)) * 100)
                    : 0}
                  %
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chart and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Comparativo de Vagas x Candidatos (Últimos 6 meses)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <canvas
                ref={chartRef}
                width={400}
                height={200}
                className="w-full h-48"
              />
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Vagas Abertas</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Candidatos Aplicados
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeJobs === 0 && closedJobs === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    Nenhuma atividade ainda
                  </p>
                  <Link href="/dashboard/company/jobs/edit" className="mt-2">
                    <Button variant="outline" size="sm">
                      Cadastrar primeira vaga
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">Empresa cadastrada com sucesso.</p>
                    </div>
                  </div>
                  {activeJobs > 0 && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm">
                          {activeJobs} vaga{activeJobs > 1 ? "s" : ""} ativa
                          {activeJobs > 1 ? "s" : ""}.
                        </p>
                      </div>
                    </div>
                  )}
                  {closedJobs > 0 && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm">
                          {closedJobs} vaga{closedJobs > 1 ? "s" : ""} encerrada
                          {closedJobs > 1 ? "s" : ""}.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
