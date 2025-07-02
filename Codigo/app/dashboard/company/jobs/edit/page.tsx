"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import {
  createJob,
  saveJob,
  getJobById,
  getCurrentCompanyCNPJ,
  type Job,
} from "@/lib/storage";

export default function JobEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("id");
  const isEditing = jobId !== null;

  const [formData, setFormData] = useState({
    title: "",
    area: "",
    contractType: "",
    workModel: "",
    city: "",
    salary: "",
    vacancies: 1,
    description: "",
    requirements: "",
    benefits: "",
  });
  const [stages, setStages] = useState([
    "Triagem",
    "Teste Técnico",
    "Entrevista",
    "Finalistas",
  ]);
  const [questions, setQuestions] = useState([
    "Por que você quer trabalhar conosco?",
    "Qual sua pretensão salarial?",
  ]);
  const [loading, setLoading] = useState(false);

  // Load existing job data if editing
  useEffect(() => {
    if (isEditing && jobId) {
      const jobData = getJobById(jobId);
      if (jobData) {
        setFormData({
          title: jobData.title,
          area: jobData.area,
          contractType: jobData.contractType,
          workModel: jobData.workModel,
          city: jobData.city,
          salary: jobData.salary,
          vacancies: jobData.vacancies,
          description: jobData.description,
          requirements: jobData.requirements,
          benefits: jobData.benefits || "",
        });
        setStages(jobData.stages);
        setQuestions(jobData.questions);
      }
    }
  }, [isEditing, jobId]);

  const updateFormField = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addStage = () => {
    setStages([...stages, "Nova Etapa"]);
  };

  const removeStage = (index: number) => {
    setStages(stages.filter((_, i) => i !== index));
  };

  const updateStage = (index: number, value: string) => {
    const newStages = [...stages];
    newStages[index] = value;
    setStages(newStages);
  };

  const addQuestion = () => {
    setQuestions([...questions, "Nova Pergunta"]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentCNPJ = getCurrentCompanyCNPJ();
    if (!currentCNPJ) {
      alert("Erro: CNPJ da empresa não encontrado. Faça login novamente.");
      return;
    }

    if (!formData.title || !formData.area || !formData.contractType) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      if (isEditing && jobId) {
        // Update existing job
        const existingJob = getJobById(jobId);
        if (!existingJob) {
          throw new Error("Vaga não encontrada");
        }

        const updatedJob: Job = {
          ...existingJob,
          title: formData.title,
          area: formData.area,
          contractType: formData.contractType,
          workModel: formData.workModel,
          city: formData.city,
          salary: formData.salary,
          vacancies: formData.vacancies,
          description: formData.description,
          requirements: formData.requirements,
          benefits: formData.benefits,
          stages,
          questions,
        };

        const success = saveJob(updatedJob);
        if (success) {
          alert("Vaga atualizada com sucesso!");
          router.push("/dashboard/company/jobs/open");
        } else {
          throw new Error("Erro ao atualizar vaga");
        }
      } else {
        // Create new job
        const newJobData = {
          companyCnpj: currentCNPJ,
          title: formData.title,
          area: formData.area,
          contractType: formData.contractType,
          workModel: formData.workModel,
          city: formData.city,
          salary: formData.salary,
          vacancies: formData.vacancies,
          description: formData.description,
          requirements: formData.requirements,
          benefits: formData.benefits,
          status: "active" as const,
          stages,
          questions,
          publishedAt: new Date().toISOString(),
        };

        const newJobId = createJob(newJobData);
        if (newJobId) {
          alert("Vaga criada com sucesso!");
          router.push("/dashboard/company/jobs/open");
        } else {
          throw new Error("Erro ao criar vaga");
        }
      }
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Erro ao salvar vaga. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
              {isEditing ? "Editar Vaga" : "Nova Vaga"}
            </h1>
            <nav className="flex space-x-2 text-sm text-gray-600 mt-1">
              <span>Vagas</span>
              <span>›</span>
              <span>{isEditing ? "Editar" : "Nova"}</span>
            </nav>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Informações da Vaga</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <Label htmlFor="title">Título da Vaga *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Analista de Dados Senior"
                  value={formData.title}
                  onChange={(e) => updateFormField("title", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="area">Área *</Label>
                <Select
                  value={formData.area}
                  onValueChange={(value) => updateFormField("area", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="RH">RH</SelectItem>
                    <SelectItem value="Vendas">Vendas</SelectItem>
                    <SelectItem value="Financeiro">Financeiro</SelectItem>
                    <SelectItem value="Operações">Operações</SelectItem>
                    <SelectItem value="Jurídico">Jurídico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contract">Tipo de Contrato *</Label>
                <Select
                  value={formData.contractType}
                  onValueChange={(value) =>
                    updateFormField("contractType", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLT">CLT</SelectItem>
                    <SelectItem value="PJ">PJ</SelectItem>
                    <SelectItem value="Freelancer">Freelancer</SelectItem>
                    <SelectItem value="Estágio">Estágio</SelectItem>
                    <SelectItem value="Terceirizado">Terceirizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="workModel">Modelo de Trabalho</Label>
                <Select
                  value={formData.workModel}
                  onValueChange={(value) => updateFormField("workModel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Presencial">Presencial</SelectItem>
                    <SelectItem value="Remoto">Remoto</SelectItem>
                    <SelectItem value="Híbrido">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  placeholder="São Paulo"
                  value={formData.city}
                  onChange={(e) => updateFormField("city", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="salary">Salário</Label>
                <Input
                  id="salary"
                  placeholder="R$ 6.000,00"
                  value={formData.salary}
                  onChange={(e) => updateFormField("salary", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="vacancies">Qtd. de Vagas</Label>
                <Input
                  id="vacancies"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.vacancies}
                  onChange={(e) =>
                    updateFormField("vacancies", parseInt(e.target.value) || 1)
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição da Vaga *</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Descreva os objetivos e responsabilidades do cargo..."
                value={formData.description}
                onChange={(e) => updateFormField("description", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requisitos *</Label>
              <Textarea
                id="requirements"
                rows={3}
                placeholder="Liste os conhecimentos, experiências e habilidades..."
                value={formData.requirements}
                onChange={(e) =>
                  updateFormField("requirements", e.target.value)
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="benefits">Benefícios</Label>
              <Textarea
                id="benefits"
                rows={2}
                placeholder="Liste os benefícios oferecidos..."
                value={formData.benefits}
                onChange={(e) => updateFormField("benefits", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Selection Process Stages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-blue-600">
              Etapas do Processo Seletivo
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addStage}
              className="flex items-center space-x-2 bg-transparent"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Etapa</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stages.map((stage, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <Input
                    value={stage}
                    onChange={(e) => updateStage(index, e.target.value)}
                    className="text-center mb-3"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeStage(index)}
                    className="w-full flex items-center justify-center space-x-1"
                    disabled={stages.length <= 1}
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remover</span>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Screening Questions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-blue-600">
              Perguntas de Triagem
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addQuestion}
              className="flex items-center space-x-2 bg-transparent"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Pergunta</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      value={question}
                      onChange={(e) => updateQuestion(index, e.target.value)}
                      placeholder="Digite a pergunta..."
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeQuestion(index)}
                    disabled={questions.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="px-8">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? "Atualizar Vaga" : "Criar Vaga"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
