"use client";

import { useState, useEffect } from "react";
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
import {
  authenticateUser,
  setCurrentUser,
  getUserDashboardUrl,
  createUser,
  clearAllStorage,
  getUserByEmail,
  debugListAllUsers,
  debugFindUserByEmail,
} from "@/lib/storage";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if test users exist, if not create them automatically
    ensureTestUsersExist();
  }, []);

  const ensureTestUsersExist = () => {
    try {
      const candidateExists = getUserByEmail("candidato@teste.com");
      const companyExists = getUserByEmail("empresa@teste.com");

      if (!candidateExists || !companyExists) {
        createTestUsers();
      }
    } catch (error) {
      console.log("Creating test users for first time...");
      createTestUsers();
    }
  };

  const createTestUsers = () => {
    // Clear existing data
    clearAllStorage();

    // Create test candidate
    const candidateId = createUser(
      "candidato@teste.com",
      "12345678",
      "candidate",
      "12345678901",
      "João Silva",
    );

    // Create test company
    const companyId = createUser(
      "empresa@teste.com",
      "12345678",
      "company",
      "12345678000195",
      "Empresa Teste Ltda",
    );

    if (candidateId && companyId) {
      console.log("Test users created successfully");
      return true;
    } else {
      console.error("Failed to create test users");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Login attempt with:", {
        email: formData.email,
        password: formData.password,
      });

      // Debug: Check if user exists
      const foundUser = debugFindUserByEmail(formData.email);
      if (foundUser) {
        console.log("User found in database:", {
          id: foundUser.id,
          email: foundUser.email,
        });
      } else {
        console.log("No user found with email:", formData.email);
      }

      const user = authenticateUser(formData.email, formData.password);

      if (!user) {
        // List all users for debugging
        debugListAllUsers();
        throw new Error("Email ou senha incorretos");
      }

      // Set current user session
      setCurrentUser(user);

      // Redirect to appropriate dashboard
      const dashboardUrl = getUserDashboardUrl(user.userType);
      router.push(dashboardUrl);
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
                Entre na sua conta
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Ou{" "}
                <Link
                  href="/auth/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  crie uma nova conta
                </Link>
              </p>

              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-600 text-center mb-2">
                  <strong>Para teste - Clique para preencher:</strong>
                </p>
                <div className="flex justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        email: "candidato@teste.com",
                        password: "12345678",
                      });
                    }}
                  >
                    Login Candidato
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        email: "empresa@teste.com",
                        password: "12345678",
                      });
                    }}
                  >
                    Login Empresa
                  </Button>
                </div>
              </div>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {error}
                    <div className="mt-3 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const success = createTestUsers();
                            if (success) {
                              alert(
                                "Usuários de teste criados!\n\nCandidato: candidato@teste.com / 12345678\nEmpresa: empresa@teste.com / 12345678",
                              );
                              setError("");
                            } else {
                              alert("Erro ao criar usuários de teste");
                            }
                          }}
                        >
                          Criar usuários de teste
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            debugListAllUsers();
                            alert(
                              "Verifique o console (F12) para ver todos os usuários cadastrados",
                            );
                          }}
                        >
                          Debug: Ver usuários
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            clearAllStorage();
                            setError("");
                            alert(
                              "Todos os dados foram limpos! Agora você pode criar novos usuários.",
                            );
                          }}
                        >
                          Limpar dados
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Se você está tendo problemas para fazer login, use os
                        botões acima para debug ou criar dados de teste.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="seu@email.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Sua senha"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Lembrar de mim
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
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
