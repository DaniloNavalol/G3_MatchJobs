"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Preloader from "@/components/preloader";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Filter, Search, Building } from "lucide-react";
import {
  getAllJobs,
  getCompanyData,
  type Job,
  type CompanyData,
} from "@/lib/storage";

interface JobWithCompany extends Job {
  company: CompanyData | null;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobWithCompany[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobWithCompany[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedWorkModel, setSelectedWorkModel] = useState("");
  const [selectedContractType, setSelectedContractType] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Get unique filter options
  const [areas, setAreas] = useState<string[]>([]);
  const [workModels, setWorkModels] = useState<string[]>([]);
  const [contractTypes, setContractTypes] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    jobs,
    searchTerm,
    selectedArea,
    selectedWorkModel,
    selectedContractType,
    selectedState,
    sortBy,
  ]);

  const loadJobs = () => {
    try {
      const allJobs = getAllJobs();
      const activeJobs = Object.values(allJobs).filter(
        (job) => job.status === "active",
      );

      // Enrich jobs with company data
      const jobsWithCompany: JobWithCompany[] = activeJobs.map((job) => ({
        ...job,
        company: getCompanyData(job.companyCnpj),
      }));

      setJobs(jobsWithCompany);

      // Extract unique filter options
      const uniqueAreas = [
        ...new Set(jobsWithCompany.map((job) => job.area).filter(Boolean)),
      ];
      const uniqueWorkModels = [
        ...new Set(jobsWithCompany.map((job) => job.workModel).filter(Boolean)),
      ];
      const uniqueContractTypes = [
        ...new Set(
          jobsWithCompany.map((job) => job.contractType).filter(Boolean),
        ),
      ];
      const uniqueStates = [
        ...new Set(
          jobsWithCompany.map((job) => job.company?.state).filter(Boolean),
        ),
      ];

      setAreas(uniqueAreas);
      setWorkModels(uniqueWorkModels);
      setContractTypes(uniqueContractTypes);
      setStates(uniqueStates);
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(search) ||
          job.company?.name.toLowerCase().includes(search) ||
          job.description.toLowerCase().includes(search) ||
          job.area.toLowerCase().includes(search),
      );
    }

    // Area filter
    if (selectedArea) {
      filtered = filtered.filter((job) => job.area === selectedArea);
    }

    // Work model filter
    if (selectedWorkModel) {
      filtered = filtered.filter((job) => job.workModel === selectedWorkModel);
    }

    // Contract type filter
    if (selectedContractType) {
      filtered = filtered.filter(
        (job) => job.contractType === selectedContractType,
      );
    }

    // State filter
    if (selectedState) {
      filtered = filtered.filter((job) => job.company?.state === selectedState);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredJobs(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedArea("");
    setSelectedWorkModel("");
    setSelectedContractType("");
    setSelectedState("");
    setSortBy("newest");
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
            <p className="mt-4 text-gray-600">Carregando vagas...</p>
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
        {/* Search Bar */}
        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Buscar vagas por título, empresa ou palavra-chave"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors"
                >
                  Buscar
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Filter className="w-5 h-5 text-green-500 mr-2" />
                      <h4 className="text-lg font-semibold">Filtros</h4>
                    </div>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Limpar
                    </button>
                  </div>

                  {/* Area Filter */}
                  <div className="mb-6">
                    <h5 className="font-medium mb-3">Área Profissional</h5>
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Todas as Áreas</option>
                      {areas.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Work Model Filter */}
                  <div className="mb-6">
                    <h5 className="font-medium mb-3">Modelo de Trabalho</h5>
                    <div className="space-y-2">
                      {workModels.map((model) => (
                        <label key={model} className="flex items-center">
                          <input
                            type="radio"
                            name="workModel"
                            value={model}
                            checked={selectedWorkModel === model}
                            onChange={(e) =>
                              setSelectedWorkModel(e.target.value)
                            }
                            className="mr-2"
                          />
                          <span className="text-sm">{model}</span>
                        </label>
                      ))}
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="workModel"
                          value=""
                          checked={selectedWorkModel === ""}
                          onChange={(e) => setSelectedWorkModel("")}
                          className="mr-2"
                        />
                        <span className="text-sm">Todos</span>
                      </label>
                    </div>
                  </div>

                  {/* Contract Type Filter */}
                  <div className="mb-6">
                    <h5 className="font-medium mb-3">Tipo de Contrato</h5>
                    <div className="space-y-2">
                      {contractTypes.map((type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="radio"
                            name="contractType"
                            value={type}
                            checked={selectedContractType === type}
                            onChange={(e) =>
                              setSelectedContractType(e.target.value)
                            }
                            className="mr-2"
                          />
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="contractType"
                          value=""
                          checked={selectedContractType === ""}
                          onChange={(e) => setSelectedContractType("")}
                          className="mr-2"
                        />
                        <span className="text-sm">Todos</span>
                      </label>
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div className="mb-6">
                    <h5 className="font-medium mb-3">Estado</h5>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Todos os Estados</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Job List */}
              <div className="lg:col-span-3">
                <div className="mb-6 flex justify-between items-center">
                  <span className="text-gray-600">
                    {filteredJobs.length} vaga
                    {filteredJobs.length !== 1 ? "s" : ""} encontrada
                    {filteredJobs.length !== 1 ? "s" : ""}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Ordenar por</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="newest">Mais recentes</option>
                      <option value="oldest">Mais antigas</option>
                      <option value="title">Título</option>
                    </select>
                  </div>
                </div>

                {filteredJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Nenhuma vaga encontrada
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Tente ajustar os filtros ou buscar por termos diferentes.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredJobs.map((job) => (
                      <div
                        key={job.id}
                        className="single-job-items bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {job.company?.logo ? (
                                <img
                                  src={job.company.logo}
                                  alt={job.company.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <Building className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <Link href={`/jobs/${job.id}`}>
                                <h4 className="text-lg font-semibold text-gray-800 hover:text-blue-600 mb-2">
                                  {job.title}
                                </h4>
                              </Link>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li className="font-medium">
                                  {job.company?.name ||
                                    "Empresa não encontrada"}
                                </li>
                                <li className="flex items-center">
                                  <MapPin size={14} className="mr-1" />
                                  {job.city}
                                  {job.company?.state
                                    ? `, ${job.company.state}`
                                    : ""}
                                </li>
                                {job.salary && (
                                  <li className="text-green-600 font-medium">
                                    {job.salary}
                                  </li>
                                )}
                                <li className="text-gray-500">
                                  <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs mr-2">
                                    {job.area}
                                  </span>
                                  {job.vacancies > 1 && (
                                    <span className="text-xs">
                                      {job.vacancies} vagas
                                    </span>
                                  )}
                                </li>
                              </ul>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex flex-col gap-1 mb-2">
                              <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                                {job.workModel}
                              </span>
                              <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                                {job.contractType}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock size={14} className="mr-1" />
                              {formatTimeAgo(job.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination - Simple for now */}
                {filteredJobs.length > 10 && (
                  <div className="mt-12 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button className="px-3 py-2 bg-blue-600 text-white rounded-md">
                        01
                      </button>
                      <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
                        02
                      </button>
                      <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
                        03
                      </button>
                      <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
                        →
                      </button>
                    </nav>
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
