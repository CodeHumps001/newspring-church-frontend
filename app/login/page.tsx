"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock, LogIn } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 via-yellow-500 to-blue-600 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10" />

      <Card className="max-w-md w-full shadow-2xl border-0 relative z-10 backdrop-blur-sm bg-white/95">
        <CardHeader className="text-center">
          {/* Logo Section */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-blue-600 rounded-full blur-lg opacity-50" />
              <div className="relative bg-white p-3 rounded-full shadow-xl">
                <Image
                  src="/logo.jpeg"
                  alt="Newspring Chapel A/G Logo"
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Church Name */}
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-yellow-600 bg-clip-text text-transparent">
            Newspring Chapel
          </CardTitle>
          <p className="text-sm text-blue-600 font-semibold mt-1">
            Assemblies of God, Ghana
          </p>
          <CardDescription className="text-gray-600 mt-2">
            Church Financial Management System
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500 w-4 h-4 transition-colors group-focus-within:text-blue-600" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@newspring.org"
                  className="pl-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500 w-4 h-4 transition-colors group-focus-within:text-blue-600" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 text-white font-semibold py-2 transition-all duration-300 shadow-lg hover:shadow-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign in
                </>
              )}
            </Button>

            {/* Demo Credentials */}
            <div className="text-center text-sm bg-gradient-to-r from-blue-50 to-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="text-gray-600 font-medium">Demo Credentials</p>
              <div className="mt-1 space-y-1">
                <p className="font-mono text-xs text-gray-500">
                  📧 admin@newspring.org
                </p>
                <p className="font-mono text-xs text-gray-500">🔑 Admin123!</p>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center">
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} Newspring Chapel A/G. All rights
                reserved.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
