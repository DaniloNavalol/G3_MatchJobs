"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Preloader from "@/components/preloader";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Building2 } from "lucide-react";
import {
  createUser,
  setCurrentUser,
  getUserDashboardUrl,
  formatCPF,
  formatCNPJ,
  validateCPF,
  validateCNPJ,
  clearAllStorage,
  updateCandidatePersonalData,
  saveCompanyData,
  type User as UserType,
  type CandidatePersonalData,
  type CompanyData,
} from "@/lib/storage";

export default function RegisterPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"candidate" | "company">(
    "candidate",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpfOrCnpj: "",
    companySize: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        throw new Error("As senhas não coincidem");
      }

      if (formData.password.length < 8) {
        throw new Error("A senha deve ter pelo menos 8 caracteres");
      }

      const cleanDoc = formData.cpfOrCnpj.replace(/\D/g, "");

      if (userType === "candidate" && !validateCPF(cleanDoc)) {
        throw new Error("CPF inválido");
      }

      if (userType === "company" && !validateCNPJ(cleanDoc)) {
        throw new Error("CNPJ inválido");
      }

      // Create user
      const userId = createUser(
        formData.email,
        formData.password,
        userType,
        cleanDoc,
        formData.fullName,
      );

      if (!userId) {
        throw new Error(
          "Erro ao criar usuário. Verifique se o email ou CPF/CNPJ já não estão cadastrados. Você pode tentar fazer login se já tem uma conta.",
        );
      }

      // Create user object for session
      const newUser: UserType = {
        id: userId,
        email: formData.email.toLowerCase(),
        password: formData.password,
        userType,
        cpfOrCnpj: cleanDoc,
        fullName: formData.fullName,
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Set current user session
      setCurrentUser(newUser);

      // Save profile data based on user type
      if (userType === "candidate") {
        const candidateData: CandidatePersonalData = {
          cpf: cleanDoc,
          fullName: formData.fullName,
          email: formData.email,
          birthDate: "",
          gender: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          cep: "",
          about: "",
        };
        const candidateSuccess = updateCandidatePersonalData(
          cleanDoc,
          candidateData,
        );
        if (!candidateSuccess) {
          console.error("Failed to create candidate profile");
        } else {
          console.log("Candidate profile created successfully");
        }
      } else if (userType === "company") {
        const companyData: CompanyData = {
          cnpj: cleanDoc,
          name: formData.fullName,
          email: formData.email,
          address: "",
          city: "",
          state: "",
          cep: "",
          foundedYear: "",
          employeeCount: formData.companySize || "",
          about: "",
          phone: "",
          website: "",
          industry: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        saveCompanyData(companyData);
      }

      // Redirect to appropriate dashboard
      const dashboardUrl = getUserDashboardUrl(userType);
      router.push(dashboardUrl);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    let value = e.target.value;

    // Format CPF/CNPJ as user types
    if (e.target.name === "cpfOrCnpj") {
      if (userType === "candidate") {
        value = formatCPF(value);
      } else {
        value = formatCNPJ(value);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  return (
    <>
      <Preloader />
      <Header />

      <main>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <div className="mx-auto h-20 w-20 flex items-center justify-center">
                <Image
                  src="/assets/img/logo/Matchjobslogo.png"
                  alt="MatchJobs"
                  width={80}
                  height={80}
                  className="h-auto"
                />
              </div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Criar nova conta
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Ou{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  faça login na sua conta existente
                </Link>
              </p>
            </div>

            {/* User Type Selection */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setUserType("candidate")}
                  className={`relative rounded-lg p-4 border-2 transition-all ${
                    userType === "candidate"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <User size={32} />
                    <span className="font-medium">Candidato</span>
                    <span className="text-xs text-center">
                      Buscar vagas e oportunidades
                    </span>
                  </div>
                  {userType === "candidate" && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setUserType("company")}
                  className={`relative rounded-lg p-4 border-2 transition-all ${
                    userType === "company"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Building2 size={32} />
                    <span className="font-medium">Empresa</span>
                    <span className="text-xs text-center">
                      Publicar vagas e contratar
                    </span>
                  </div>
                  {userType === "company" && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              </div>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {error}
                    {error.includes("já cadastrado") && (
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            clearAllStorage();
                            setError("");
                            alert("Dados de teste limpos. Tente novamente.");
                          }}
                        >
                          Limpar dados de teste
                        </Button>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">
                    {userType === "candidate"
                      ? "Nome completo"
                      : "Nome da empresa"}
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder={
                      userType === "candidate"
                        ? "Seu nome completo"
                        : "Nome da sua empresa"
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="cpfOrCnpj">
                    {userType === "candidate" ? "CPF" : "CNPJ"}
                  </Label>
                  <Input
                    id="cpfOrCnpj"
                    name="cpfOrCnpj"
                    type="text"
                    value={formData.cpfOrCnpj}
                    onChange={handleChange}
                    required
                    placeholder={
                      userType === "candidate"
                        ? "000.000.000-00"
                        : "00.000.000/0000-00"
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={
                      userType === "candidate"
                        ? "seu@email.com"
                        : "contato@empresa.com"
                    }
                    className="mt-1"
                  />
                </div>

                {userType === "company" && (
                  <div>
                    <Label htmlFor="companySize">Tamanho da empresa</Label>
                    <select
                      id="companySize"
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Selecione o tamanho</option>
                      <option value="1-10">1-10 funcionários</option>
                      <option value="11-50">11-50 funcionários</option>
                      <option value="51-200">51-200 funcionários</option>
                      <option value="201-500">201-500 funcionários</option>
                      <option value="500+">Mais de 500 funcionários</option>
                    </select>
                  </div>
                )}

                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Mínimo 8 caracteres"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirme sua senha"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="agree-terms"
                  name="agreeTerms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="agree-terms"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Concordo com os{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Termos de Uso
                  </a>{" "}
                  e{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Política de Privacidade
                  </a>
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? "Criando conta..."
                  : userType === "candidate"
                    ? "Criar conta como Candidato"
                    : "Criar conta como Empresa"}
              </Button>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">
                      Ou continue com
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      // TODO: Implement Google Sign In
                      alert(
                        "Integração com Google será implementada em breve!",
                      );
                    }}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continuar com Google
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
