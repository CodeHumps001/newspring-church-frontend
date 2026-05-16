"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/Layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Moon,
  Sun,
  Key,
  Save,
  Download,
  Church,
} from "lucide-react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import api from "@/services/api";

export default function SettingsPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [colorScheme, setColorScheme] = useState("blue");

  // Profile form state
  const [profileData, setProfileData] = useState({
    email: user?.email || "",
    fullName: "Church Administrator",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Load saved color scheme from localStorage
    const savedColor = localStorage.getItem("colorScheme");
    if (savedColor) {
      setColorScheme(savedColor);
      applyColorScheme(savedColor);
    }
  }, []);

  const applyColorScheme = (color: string) => {
    const root = document.documentElement;
    const colors = {
      blue: { primary: "#3b82f6", hover: "#2563eb" },
      green: { primary: "#22c55e", hover: "#16a34a" },
      purple: { primary: "#a855f7", hover: "#9333ea" },
      red: { primary: "#ef4444", hover: "#dc2626" },
      orange: { primary: "#f97316", hover: "#ea580c" },
    };

    root.style.setProperty(
      "--primary-color",
      colors[color as keyof typeof colors].primary,
    );
    root.style.setProperty(
      "--primary-hover",
      colors[color as keyof typeof colors].hover,
    );
  };

  const handleColorSchemeChange = (color: string) => {
    setColorScheme(color);
    localStorage.setItem("colorScheme", color);
    applyColorScheme(color);
    toast.success(
      `${color.charAt(0).toUpperCase() + color.slice(1)} theme applied`,
    );
  };

  const getInitials = (email: string) => {
    return email?.substring(0, 2).toUpperCase() || "AD";
  };

  // Update Profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.put("/auth/update-profile", {
        email: profileData.email,
        fullName: profileData.fullName,
      });

      // Update local storage with new user data
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Profile updated successfully!");

      // Re-login to refresh token if email changed
      if (response.data.newToken) {
        localStorage.setItem("token", response.data.newToken);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await api.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  // Export CSV
  const handleExportCSV = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/reports/export-csv", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `church-financial-report-${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Report exported successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to export data");
    } finally {
      setIsLoading(false);
    }
  };

  // Export PDF
  const handleExportPDF = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/reports/export-pdf", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `church-financial-report-${new Date().toISOString().split("T")[0]}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("PDF exported successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to export PDF");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account preferences and system configuration
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Church className="w-4 h-4" />
              <span className="hidden sm:inline">About</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                      {user?.email ? getInitials(user.email) : "AD"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {user?.email || "admin@newspring.org"}
                    </h3>
                    <p className="text-sm text-gray-500">Administrator</p>
                    <Badge variant="secondary" className="mt-1">
                      Active
                    </Badge>
                  </div>
                </div>

                <Separator />

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          fullName: e.target.value,
                        })
                      }
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Change your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Enter new password"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Password must be at least 6 characters long
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      <Key className="w-4 h-4 mr-2" />
                      {isLoading ? "Changing..." : "Change Password"}
                    </Button>
                  </div>
                </form>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Data Export</h3>
                  <div className="flex gap-4">
                    <Button
                      onClick={handleExportCSV}
                      variant="outline"
                      disabled={isLoading}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button
                      onClick={handleExportPDF}
                      variant="outline"
                      disabled={isLoading}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Preferences</CardTitle>
                <CardDescription>
                  Customize how the application looks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setTheme("light")}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        theme === "light"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                      <p className="font-medium">Light</p>
                      <p className="text-xs text-gray-500">Default theme</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme("dark")}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        theme === "dark"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Moon className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                      <p className="font-medium">Dark</p>
                      <p className="text-xs text-gray-500">Modern dark theme</p>
                    </button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Color Scheme</Label>
                  <div className="flex gap-3">
                    {["blue", "green", "purple", "red", "orange"].map(
                      (color) => (
                        <button
                          key={color}
                          onClick={() => handleColorSchemeChange(color)}
                          className={`w-10 h-10 rounded-full transition-all ${
                            colorScheme === color
                              ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                              : ""
                          }`}
                          style={{
                            backgroundColor:
                              color === "blue"
                                ? "#3b82f6"
                                : color === "green"
                                  ? "#22c55e"
                                  : color === "purple"
                                    ? "#a855f7"
                                    : color === "red"
                                      ? "#ef4444"
                                      : "#f97316",
                          }}
                        />
                      ),
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About Newspring Chapel</CardTitle>
                <CardDescription>
                  Information about the church management system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-6">
                  <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
                    <Church className="w-12 h-12 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Newspring Chapel A/G
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Church Financial Management System
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    Version 2.0.0
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Features</h3>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li>• Track Tithes, Offerings, and Special Seeds</li>
                      <li>• Children Service financial management</li>
                      <li>• Automated denomination calculations</li>
                      <li>• Monthly and weekly reporting</li>
                      <li>• CSV and PDF export</li>
                      <li>• Edit and delete records</li>
                      <li>• Dark/Light theme support</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Support</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      For technical support, please contact:
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      support@newspringchapel.org
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="text-center text-xs text-gray-500">
                  <p>© {new Date().getFullYear()} Newspring Chapel A/G</p>
                  <p className="mt-1">All rights reserved</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
