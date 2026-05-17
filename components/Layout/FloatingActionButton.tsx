"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const actions = [
    { name: "Add Income", href: "/records/new", icon: "💰" },
    { name: "Add Expense", href: "/expenses/new", icon: "💸" },
  ];

  return (
    <div className="fixed bottom-20 right-4 z-50 lg:hidden">
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 space-y-2">
          {actions.map((action) => (
            <Button
              key={action.name}
              onClick={() => {
                router.push(action.href);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg w-full justify-start px-4"
            >
              <span>{action.icon}</span>
              <span>{action.name}</span>
            </Button>
          ))}
        </div>
      )}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-full w-14 h-14 shadow-lg transition-transform duration-200 ${
          isOpen
            ? "rotate-45 bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <PlusIcon className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
}
