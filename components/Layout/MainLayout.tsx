"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  HomeIcon,
  PlusCircleIcon,
  DocumentChartBarIcon,
  CogIcon, // Fixed: Changed from CogIcon to Cog6Icon
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "New Entry", href: "/records/new", icon: PlusCircleIcon },
  {
    name: "Monthly Report",
    href: "/reports/monthly",
    icon: DocumentChartBarIcon,
  },
  { name: "Settings", href: "/settings", icon: CogIcon }, // Fixed here too
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="relative flex flex-col w-64 bg-white h-full">
          <div className="flex justify-end p-4">
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t">
            <div className="text-sm text-gray-500 mb-2">{user?.email}</div>
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-700 rounded-lg hover:bg-red-50"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 bg-white border-r">
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <h1 className="text-xl font-bold text-blue-700">
              Newspring Chapel
            </h1>
          </div>
          <nav className="flex-1 px-4 mt-8 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t">
            <div className="text-sm text-gray-500 mb-2">{user?.email}</div>
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-700 rounded-lg hover:bg-red-50"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 bg-white border-b lg:hidden">
          <div className="flex items-center justify-between px-4 h-16">
            <button onClick={() => setSidebarOpen(true)}>
              <Bars3Icon className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-blue-700">
              Newspring Chapel
            </h1>
            <div className="w-6" />
          </div>
        </div>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
