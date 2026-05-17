"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  PlusCircleIcon,
  CreditCardIcon,
  DocumentChartBarIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  PlusCircleIcon as PlusCircleIconSolid,
  CreditCardIcon as CreditCardIconSolid,
  DocumentChartBarIcon as DocumentChartBarIconSolid,
  CogIcon as CogIconSolid,
} from "@heroicons/react/24/solid";

const navItems = [
  {
    name: "Home",
    href: "/dashboard",
    icon: HomeIcon,
    activeIcon: HomeIconSolid,
  },
  {
    name: "Income",
    href: "/records/new",
    icon: PlusCircleIcon,
    activeIcon: PlusCircleIconSolid,
  },
  {
    name: "Expense",
    href: "/expenses/new",
    icon: CreditCardIcon,
    activeIcon: CreditCardIconSolid,
  },
  {
    name: "Reports",
    href: "/reports/monthly",
    icon: DocumentChartBarIcon,
    activeIcon: DocumentChartBarIconSolid,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: CogIcon,
    activeIcon: CogIconSolid,
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Check if the current path matches the nav item
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg lg:hidden z-50">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = active ? item.activeIcon : item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center px-3 py-1 rounded-lg transition-all duration-200 ${
                active ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">{item.name}</span>
              {active && (
                <div className="absolute -top-2 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
