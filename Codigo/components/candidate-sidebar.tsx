"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Briefcase, UserCheck, Menu, X } from "lucide-react";
import { useState } from "react";

export default function CandidateSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      items: [
        { name: "Perfil", href: "/dashboard/candidate" },
        { name: "Editar Perfil", href: "/dashboard/candidate/profile/edit" },
      ],
    },
    {
      title: "Vagas",
      icon: Briefcase,
      items: [
        { name: "Feed Geral", href: "/jobs" },
        {
          name: "Vagas Compatíveis",
          href: "/dashboard/candidate/jobs/compatible",
        },
      ],
    },
    {
      title: "Análise Comportamental",
      icon: UserCheck,
      items: [
        { name: "Ver Análise", href: "/dashboard/candidate/analysis" },
        { name: "Refazer Análise", href: "/dashboard/candidate/analysis/edit" },
      ],
    },
  ];

  return (
    <div
      className={`sidebar bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}
    >
      <div className="sidebar-logo p-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/candidate" className="flex items-center">
            <Image
              src="/assets/img/logo/matchjoblogowhite.png"
              alt="MatchJobs"
              width={isCollapsed ? 30 : 120}
              height={30}
              className="h-auto"
            />
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-gray-800"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
      </div>

      <div className="sidebar-wrapper px-4">
        <nav className="space-y-2">
          {menuItems.map((section, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center space-x-3 px-3 py-2 text-gray-300">
                <section.icon size={20} />
                {!isCollapsed && (
                  <span className="font-medium">{section.title}</span>
                )}
              </div>
              {!isCollapsed && (
                <div className="ml-6 space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      href={item.href}
                      className={`block px-3 py-2 rounded text-sm transition-colors ${
                        pathname === item.href
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
