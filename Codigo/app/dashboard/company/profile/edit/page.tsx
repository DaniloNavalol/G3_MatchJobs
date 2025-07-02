"use client";

import { useState, useEffect } from "react";
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
import { ArrowLeft, Check, Building } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getCompanyData,
  saveCompanyData,
  getCurrentCompanyCNPJ,
  setCurrentCompanyCNPJ,
  formatCNPJ,
  validateCNPJ,
  type CompanyData,
} from "@/lib/storage";

export default function CompanyProfileEdit() {
  const router = useRouter();
  const [companyData, setCompanyData] = useState<CompanyData>({
    cnpj: "",
    name: "",
    address: "",
    city: "",
    state: "",
    cep: "",
    foundedYear: "",
    employeeCount: "",
    about: "",
    email: "",
    phone: "",
    website: "",
    industry: "",
    createdAt: "",
    updatedAt: "",
  });

  // Load existing data
  useEffect(() => {
    const currentCNPJ = getCurrentCompanyCNPJ();
    if (currentCNPJ) {
      const existingData = getCompanyData(currentCNPJ);
      if (existingData) {
        setCompanyData(existingData);
      }
    }
  }, []);

  const updateField = (field: keyof CompanyData, value: string) => {
    setCompanyData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCNPJ(companyData.cnpj)) {
      alert("CNPJ inválido");
      return;
    }

    const cleanCNPJ = companyData.cnpj.replace(/\D/g, "");
    const success = saveCompanyData(companyData);

    if (success) {
      setCurrentCompanyCNPJ(cleanCNPJ);
      alert("Dados da empresa salvos com sucesso!");
      router.push("/dashboard/company");
    } else {
      alert("Erro ao salvar dados da empresa");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Editar Perfil da Empresa
            </h1>
            <nav className="flex space-x-2 text-sm text-gray-600 mt-2">
              <span>Empresa</span>
              <span>›</span>
              <span>Editar Perfil</span>
            </nav>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Nome da Empresa *</Label>
                <Input
                  id="name"
                  value={companyData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Digite o nome da empresa"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={companyData.cnpj}
                  onChange={(e) =>
                    updateField("cnpj", formatCNPJ(e.target.value))
                  }
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  required
                />
              </div>

              <div>
                <Label htmlFor="industry">Setor de Atuação *</Label>
                <Select
                  value={companyData.industry}
                  onValueChange={(value) => updateField("industry", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o setor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="Saúde">Saúde</SelectItem>
                    <SelectItem value="Educação">Educação</SelectItem>
                    <SelectItem value="Financeiro">Financeiro</SelectItem>
                    <SelectItem value="Varejo">Varejo</SelectItem>
                    <SelectItem value="Manufatura">Manufatura</SelectItem>
                    <SelectItem value="Consultoria">Consultoria</SelectItem>
                    <SelectItem value="Recursos Humanos">
                      Recursos Humanos
                    </SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Logística">Logística</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="foundedYear">Ano de Fundação</Label>
                <Input
                  id="foundedYear"
                  type="number"
                  min="1900"
                  max="2024"
                  value={companyData.foundedYear}
                  onChange={(e) => updateField("foundedYear", e.target.value)}
                  placeholder="2015"
                />
              </div>

              <div>
                <Label htmlFor="employeeCount">Número de Funcionários</Label>
                <Select
                  value={companyData.employeeCount}
                  onValueChange={(value) => updateField("employeeCount", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 funcionários</SelectItem>
                    <SelectItem value="11-50">11-50 funcionários</SelectItem>
                    <SelectItem value="51-100">51-100 funcionários</SelectItem>
                    <SelectItem value="101-500">
                      101-500 funcionários
                    </SelectItem>
                    <SelectItem value="501-1000">
                      501-1000 funcionários
                    </SelectItem>
                    <SelectItem value="1000+">
                      Mais de 1000 funcionários
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={companyData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="contato@empresa.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={companyData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="(11) 9999-9999"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={companyData.website}
                  onChange={(e) => updateField("website", e.target.value)}
                  placeholder="https://www.empresa.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Endereço Completo</Label>
              <Input
                id="address"
                value={companyData.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Rua, número, complemento"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={companyData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="São Paulo"
                />
              </div>

              <div>
                <Label htmlFor="state">Estado</Label>
                <Select
                  value={companyData.state}
                  onValueChange={(value) => updateField("state", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                    <SelectItem value="PR">Paraná</SelectItem>
                    <SelectItem value="SC">Santa Catarina</SelectItem>
                    <SelectItem value="BA">Bahia</SelectItem>
                    <SelectItem value="GO">Goiás</SelectItem>
                    <SelectItem value="ES">Espírito Santo</SelectItem>
                    <SelectItem value="MA">Maranhão</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={companyData.cep}
                  onChange={(e) => updateField("cep", e.target.value)}
                  placeholder="00000-000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Company */}
        <Card>
          <CardHeader>
            <CardTitle>Sobre a Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="about">Descrição da Empresa</Label>
            <Textarea
              id="about"
              rows={5}
              value={companyData.about}
              onChange={(e) => updateField("about", e.target.value)}
              placeholder="Descreva a empresa, missão, valores, cultura organizacional..."
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-1">
              {companyData.about.length}/1000 caracteres
            </p>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" className="px-8">
            <Check className="w-4 h-4 mr-2" />
            Salvar Perfil da Empresa
          </Button>
        </div>
      </form>
    </div>
  );
}
