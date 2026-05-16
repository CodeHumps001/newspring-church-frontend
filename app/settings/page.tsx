"use client";

import { useState } from "react";
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
  Database,
  Palette,
  Globe,
  Moon,
  Sun,
  Key,
  Save,
  RefreshCw,
  Download,
  Trash2,
  Church,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState("light");

  const getInitials = (email: string) => {
    return email?.substring(0, 2).toUpperCase() || "AD";
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Profile updated successfully!");
      setIsLoading(false);
    }, 1000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Password changed successfully!");
      setIsLoading(false);
    }, 1000);
  };

  const handleExportData = () => {
    toast.success("Data export started. You'll receive an email shortly.");
  };

  const handleBackupDatabase = () => {
    toast.success("Database backup completed successfully!");
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account preferences and system configuration
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
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
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Data</span>
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
                  Update your account information and email preferences
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user?.email || "admin@newspring.org"}
                        placeholder="Enter your email"
                      />
                      <p className="text-xs text-gray-500">
                        Changing email will require re-verification
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        defaultValue="Church Administrator"
                        placeholder="Enter your full name"
                      />
                    </div>
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
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters long
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
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
                  <h3 className="text-lg font-semibold">
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable 2FA</p>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch />
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
                      <p className="text-xs text-gray-500">Coming soon</p>
                    </button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Color Scheme</Label>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-full bg-blue-600 ring-2 ring-blue-600 ring-offset-2" />
                    <button className="w-10 h-10 rounded-full bg-green-600 hover:ring-2 hover:ring-green-600 hover:ring-offset-2" />
                    <button className="w-10 h-10 rounded-full bg-purple-600 hover:ring-2 hover:ring-purple-600 hover:ring-offset-2" />
                    <button className="w-10 h-10 rounded-full bg-red-600 hover:ring-2 hover:ring-red-600 hover:ring-offset-2" />
                    <button className="w-10 h-10 rounded-full bg-orange-600 hover:ring-2 hover:ring-orange-600 hover:ring-offset-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Export, backup, or manage your church financial data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Export Financial Data</h3>
                      <p className="text-sm text-gray-500">
                        Download all records as CSV or Excel
                      </p>
                    </div>
                    <Button onClick={handleExportData} variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Backup Database</h3>
                      <p className="text-sm text-gray-500">
                        Create a full backup of your database
                      </p>
                    </div>
                    <Button onClick={handleBackupDatabase} variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Backup Now
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-red-600">
                      Danger Zone
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <h3 className="font-semibold text-red-700">
                          Delete All Data
                        </h3>
                        <p className="text-sm text-red-600">
                          Permanently delete all financial records
                        </p>
                      </div>
                      <Button variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete All
                      </Button>
                    </div>
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
                    Version 1.0.0
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
                      <li>• PDF report generation</li>
                      <li>• Secure admin authentication</li>
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

                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Newspring Chapel A/G
                      <br />
                      Your Church Address Here
                      <br />
                      Ghana
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
