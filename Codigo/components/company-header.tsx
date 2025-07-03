"use client";

import { Bell, User } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  getCurrentUser,
  getCompanyData,
  getNotificationsByUserId,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  logout,
  type Notification,
} from "@/lib/storage";

export default function CompanyHeader() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadUserData();
  }, []);

  // Listen for localStorage changes to update company data in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "companies_data" && user && user.userType === "company") {
        const companyData = getCompanyData(user.cpfOrCnpj);
        console.log("Storage changed, updating company data:", companyData);
        setCompany(companyData);
      }
    };

    const handleFocus = () => {
      if (user && user.userType === "company") {
        const companyData = getCompanyData(user.cpfOrCnpj);
        setCompany(companyData);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);

    // Also check periodically for updates (in case storage event doesn't fire)
    const interval = setInterval(() => {
      if (user && user.userType === "company") {
        const companyData = getCompanyData(user.cpfOrCnpj);
        // More detailed comparison to catch logo changes
        if (
          companyData &&
          (!company || companyData.updatedAt !== company.updatedAt)
        ) {
          console.log(
            "Periodic check: updating company data with logo:",
            companyData.logo ? "YES" : "NO",
          );
          setCompany(companyData);
        }
      }
    }, 5000); // Reduced frequency to 5 seconds

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, [user?.id, mounted]); // Only depend on user ID and mounted state

  const loadUserData = () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        // Use replace instead of push and wrap in setTimeout to avoid navigation conflicts
        setTimeout(() => {
          if (mounted) {
            router.replace("/auth/login");
          }
        }, 100);
        return;
      }

      setUser(currentUser);

      if (currentUser.userType === "company") {
        const companyData = getCompanyData(currentUser.cpfOrCnpj);
        console.log("Loading company data:", companyData);
        setCompany(companyData);
      }

      // Load notifications
      const userNotifications = getNotificationsByUserId(currentUser.id);
      setNotifications(userNotifications);
      setUnreadCount(getUnreadNotificationsCount(currentUser.id));
    } catch (error) {
      console.error("Error loading user data:", error);
      // Fallback redirect on error
      setTimeout(() => {
        if (mounted) {
          router.replace("/auth/login");
        }
      }, 100);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleMarkAllAsRead = () => {
    if (user) {
      markAllNotificationsAsRead(user.id);
      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true })),
      );
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notification.id ? { ...notif, isRead: true } : notif,
        ),
      );
    }
  };

  if (!user) return null;

  const displayName = company?.name || user.fullName || "Empresa";
  const displayEmail = company?.email || user.email;

  // Debug logging
  console.log(
    "Company header render - company logo:",
    company?.logo ? "EXISTS" : "MISSING",
    company?.logo?.substring(0, 50),
  );

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-end space-x-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-3 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">
                  {notifications.length > 0
                    ? `Você tem ${unreadCount} notificações`
                    : "Nenhuma notificação"}
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Marcar todas como lidas
                  </button>
                )}
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-3 text-center text-gray-500">
                  <p className="text-sm">Nenhuma notificação ainda.</p>
                </div>
              ) : (
                notifications.slice(0, 10).map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`p-3 border-b cursor-pointer ${!notification.isRead ? "bg-blue-50" : ""}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === "application"
                            ? "bg-blue-500"
                            : notification.type === "interview"
                              ? "bg-green-500"
                              : notification.type === "job_update"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                        }`}
                      ></div>
                      <div>
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              {company?.logo && company.logo.trim() !== "" ? (
                <img
                  src={company.logo}
                  alt={displayName}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  onError={(e) => {
                    console.log("Failed to load company logo");
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              )}
              <div className="text-left">
                <p className="text-sm text-gray-600">Olá,</p>
                <p className="text-sm font-semibold">{displayName}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="p-3 border-b">
              <div className="flex items-center space-x-3">
                {company?.logo && company.logo.trim() !== "" ? (
                  <img
                    src={company.logo}
                    alt={displayName}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    onError={(e) => {
                      console.log("Failed to load company logo in dropdown");
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h4 className="font-semibold">{displayName}</h4>
                  <p className="text-sm text-gray-600">{displayEmail}</p>
                  <Link
                    href="/dashboard/company"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Ver Perfil da Empresa
                  </Link>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
