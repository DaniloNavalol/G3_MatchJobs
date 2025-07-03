"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, User, Building, LogOut } from "lucide-react";
import {
  getCurrentUser,
  getCandidateData,
  getCompanyData,
  logout,
  getUserDashboardUrl,
  type User as UserType,
} from "@/lib/storage";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    loadUserData();

    // Listen for login/logout events
    const handleUserChange = () => {
      loadUserData();
    };

    window.addEventListener("userDataChanged" as any, handleUserChange);

    // Also listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "current_user" ||
        e.key === "companies_data" ||
        e.key === "candidates_data"
      ) {
        loadUserData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("userDataChanged" as any, handleUserChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const loadUserData = () => {
    try {
      const user = getCurrentUser();
      setCurrentUser(user);

      if (user) {
        // Load profile data based on user type
        if (user.userType === "candidate") {
          const candidateData = getCandidateData(user.cpfOrCnpj);
          setUserProfile(candidateData);
        } else if (user.userType === "company") {
          const companyData = getCompanyData(user.cpfOrCnpj);
          setUserProfile(companyData);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setUserProfile(null);
    setShowUserMenu(false);
    router.push("/");
  };

  const goToDashboard = () => {
    if (currentUser) {
      const dashboardUrl = getUserDashboardUrl(currentUser.userType);
      router.push(dashboardUrl);
    }
  };

  const getUserDisplayName = () => {
    if (!currentUser) return "";

    if (currentUser.userType === "candidate") {
      return (
        userProfile?.personal?.fullName || currentUser.fullName || "Usuário"
      );
    } else {
      return userProfile?.name || currentUser.fullName || "Empresa";
    }
  };

  const getUserDisplayEmail = () => {
    if (!currentUser) return "";

    if (currentUser.userType === "candidate") {
      return userProfile?.personal?.email || currentUser.email;
    } else {
      return userProfile?.email || currentUser.email;
    }
  };

  const getUserPhoto = () => {
    if (!currentUser) return null;

    if (currentUser.userType === "candidate") {
      return userProfile?.personal?.profileImage;
    } else {
      return userProfile?.logo;
    }
  };

  return (
    <header>
      <div className="header-area header-transparent">
        <div className="border-b border-gray-200 bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <div className="flex-shrink-0">
                <Link href="/">
                  <Image
                    src="/assets/img/logo/matchjoblogo.png"
                    alt="MatchJobs"
                    width={240}
                    height={60}
                    className="h-auto"
                  />
                </Link>
              </div>

              <div className="hidden lg:flex items-center space-x-8">
                <nav className="flex space-x-8">
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Início
                  </Link>
                  <Link
                    href="/jobs"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Buscar Vagas
                  </Link>
                </nav>

                <div className="flex items-center space-x-4">
                  {currentUser ? (
                    // User is logged in - show profile
                    <div className="relative">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center space-x-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200">
                          {getUserPhoto() ? (
                            <img
                              src={getUserPhoto()}
                              alt={getUserDisplayName()}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              {currentUser.userType === "candidate" ? (
                                <User className="w-5 h-5 text-gray-500" />
                              ) : (
                                <Building className="w-5 h-5 text-gray-500" />
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-gray-600">Olá,</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {getUserDisplayName().split(" ")[0]}
                          </p>
                        </div>
                      </button>

                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                          <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200">
                                {getUserPhoto() ? (
                                  <img
                                    src={getUserPhoto()}
                                    alt={getUserDisplayName()}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    {currentUser.userType === "candidate" ? (
                                      <User className="w-6 h-6 text-gray-500" />
                                    ) : (
                                      <Building className="w-6 h-6 text-gray-500" />
                                    )}
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800">
                                  {getUserDisplayName()}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {getUserDisplayEmail()}
                                </p>
                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                  {currentUser.userType === "candidate"
                                    ? "Candidato"
                                    : "Empresa"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="p-2">
                            <button
                              onClick={goToDashboard}
                              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded w-full text-left"
                            >
                              {currentUser.userType === "candidate" ? (
                                <User className="w-4 h-4" />
                              ) : (
                                <Building className="w-4 h-4" />
                              )}
                              <span>Ir para Dashboard</span>
                            </button>
                            <button
                              onClick={handleLogout}
                              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded w-full text-left"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Logout</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // User is not logged in - show login/register buttons
                    <>
                      <Link href="/auth/register" className="head-btn1">
                        Cadastrar
                      </Link>
                      <Link href="/auth/login" className="head-btn2">
                        Entrar
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-700 hover:text-blue-600"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
              <div className="lg:hidden py-4 border-t border-gray-200">
                <nav className="flex flex-col space-y-4">
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Início
                  </Link>
                  <Link
                    href="/jobs"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Buscar Vagas
                  </Link>

                  {currentUser ? (
                    // Mobile user menu
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200">
                          {getUserPhoto() ? (
                            <img
                              src={getUserPhoto()}
                              alt={getUserDisplayName()}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              {currentUser.userType === "candidate" ? (
                                <User className="w-5 h-5 text-gray-500" />
                              ) : (
                                <Building className="w-5 h-5 text-gray-500" />
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {getUserDisplayName()}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {currentUser.userType === "candidate"
                              ? "Candidato"
                              : "Empresa"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={goToDashboard}
                          className="head-btn1 text-center"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={handleLogout}
                          className="head-btn2 text-center"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Mobile login/register buttons
                    <div className="flex flex-col space-y-2 pt-4">
                      <Link
                        href="/auth/register"
                        className="head-btn1 text-center"
                      >
                        Cadastrar
                      </Link>
                      <Link
                        href="/auth/login"
                        className="head-btn2 text-center"
                      >
                        Entrar
                      </Link>
                    </div>
                  )}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menus */}
      {(showUserMenu || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setIsMenuOpen(false);
          }}
        />
      )}
    </header>
  );
}
