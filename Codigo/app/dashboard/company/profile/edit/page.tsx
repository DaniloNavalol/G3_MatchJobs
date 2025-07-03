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
import { ArrowLeft, Check, Building, Upload, X } from "lucide-react";
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
    logo: "",
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

  const compressImage = (
    file: File,
    maxWidth: number = 300,
    quality: number = 0.8,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = (width * maxWidth) / height;
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);

        // Check if compressed size is reasonable (less than 500KB when base64 encoded)
        if (compressedDataUrl.length > 500 * 1024) {
          // Try with lower quality
          const lowerQualityDataUrl = canvas.toDataURL("image/jpeg", 0.5);
          resolve(lowerQualityDataUrl);
        } else {
          resolve(compressedDataUrl);
        }
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File type validation
    if (!file.type.startsWith("image/")) {
      alert(
        "Por favor, selecione um arquivo de imagem válido (JPG, PNG, etc.)",
      );
      return;
    }

    // File size validation (10MB limit for original file)
    if (file.size > 10 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 10MB");
      return;
    }

    try {
      // Show loading state
      const originalLogo = companyData.logo;
      updateField("logo", "loading");

      // Compress the image
      const compressedImage = await compressImage(file, 300, 0.8);

      // Final size check for localStorage
      const estimatedSize = new Blob([compressedImage]).size;
      if (estimatedSize > 1024 * 1024) {
        // 1MB limit for compressed
        alert(
          "A imagem comprimida ainda é muito grande. Tente uma imagem menor ou de menor resolução.",
        );
        updateField("logo", originalLogo);
        return;
      }

      updateField("logo", compressedImage);
    } catch (error) {
      console.error("Error compressing image:", error);
      alert(
        "Erro ao processar a imagem. Tente novamente com uma imagem diferente.",
      );
      updateField("logo", companyData.logo); // Reset to original
    }
  };

  const removeLogo = () => {
    updateField("logo", "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCNPJ(companyData.cnpj)) {
      alert("CNPJ inválido");
      return;
    }

    // Check if logo is being loaded
    if (companyData.logo === "loading") {
      alert("Aguarde o processamento da imagem finalizar");
      return;
    }

    try {
      const cleanCNPJ = companyData.cnpj.replace(/\D/g, "");
      const success = saveCompanyData(companyData);

      if (success) {
        setCurrentCompanyCNPJ(cleanCNPJ);
        alert("Dados da empresa salvos com sucesso!");
        router.push("/dashboard/company");
      } else {
        alert("Erro ao salvar dados da empresa");
      }
    } catch (error) {
      console.error("Error saving company:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Erro inesperado ao salvar dados da empresa");
      }
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
        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              Logo da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {companyData.logo === "loading" ? (
                  <div className="w-24 h-24 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="text-xs text-gray-600 mt-1">
                        Processando...
                      </span>
                    </div>
                  </div>
                ) : companyData.logo && companyData.logo !== "" ? (
                  <div className="relative">
                    <img
                      src={companyData.logo}
                      alt="Logo da empresa"
                      className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="logo">Carregar Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="mt-1"
                  disabled={companyData.logo === "loading"}
                />
                <div className="text-sm text-gray-500 mt-1">
                  <p>• Recomendado: imagem quadrada, até 10MB</p>
                  <p>• A imagem será automaticamente comprimida</p>
                  <p>• Formatos aceitos: JPG, PNG, GIF, WebP</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
