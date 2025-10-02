"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import axiosInstance from "../../axios/axios";
import { useDispatch } from "react-redux";
import { login } from "@/app/store/userSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { InputField } from "@/app/Components/InputField";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remeberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        "/auth/login",
        { email, password, rememberMe: remeberMe },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const data = res.data;
      dispatch(login(data.user));
      router.push("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-black to-gray-800 text-white p-10">
        <h2 className="text-5xl font-bold mb-4">Welcome Back</h2>
        <p className="text-gray-300 text-lg text-center max-w-md">
          Sign in to continue where you left off.
        </p>
      </div>

      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Sign in to Your Account
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Enter your details to log in.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              id="email"
              label="Email Address"
              icon={<Mail className="h-5 w-5 text-gray-400" />}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  onChange={(e) => setRememberMe(e.target.checked)}
                  type="checkbox"
                  className="h-4 w-4 text-black border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-black hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors shadow-md"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-sm text-center text-gray-600">
              Don’t have an account?{" "}
              <Link
                href="/pages/signup"
                className="font-medium text-black cursor-pointer hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
