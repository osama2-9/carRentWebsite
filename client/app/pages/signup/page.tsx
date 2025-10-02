"use client";
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Calendar,
  Globe,
  Lock,
  Phone,
} from "lucide-react";
import axiosInstance from "@/app/axios/axios";
import { useDispatch } from "react-redux";
import { login } from "@/app/store/userSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function SignupForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [remeberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    nationality: "",
    password: "",
    phoneNumber: "",
    gender: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "/auth/signup",
        {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          phone: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth,
          nationality: formData.nationality,
          remeberMe: remeberMe,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const data = await res.data;
      if (data) {
        dispatch(login(data.user));
        router.push("/");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className=" w-full bg-white/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Section */}
          <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-black to-gray-800 text-white p-10">
            <h2 className="text-4xl font-bold mb-4">Join Us Today</h2>
            <p className="text-gray-300 text-lg text-center">
              Sign up and unlock access to all our exclusive features.
            </p>
          </div>

          {/* Right Section */}
          <div className="p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
              Create Your Account
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Fill in the details below to get started.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <Field
                id="fullName"
                label="Full Name"
                icon={<User className="h-5 w-5 text-gray-400" />}
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
              />

              {/* Email */}
              <Field
                id="email"
                label="Email Address"
                icon={<Mail className="h-5 w-5 text-gray-400" />}
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />

              {/* Date of Birth */}
              <Field
                id="dateOfBirth"
                label="Date of Birth"
                icon={<Calendar className="h-5 w-5 text-gray-400" />}
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />

              {/* Nationality */}
              <SelectField
                id="nationality"
                label="Nationality"
                icon={<Globe className="h-5 w-5 text-gray-400" />}
                value={formData.nationality}
                onChange={handleChange}
                options={[
                  "Palestine",
                  "Egypt",
                  "Lebanon",
                  "Syria",
                  "Jordan",
                  "Iraq",
                  "Yemen",
                  "Kuwait",
                  "Oman",
                  "Qatar",
                  "Bahrain",
                  "United Arab Emirates",
                  "Saudi Arabia",
                  "United Kingdom",
                  "United States",
                  "Canada",
                  "Australia",
                  "New Zealand",
                  "Germany",
                  "France",
                  "Spain",
                  "Italy",
                  "Japan",
                  "China",
                  "Brazil",
                  "Argentina",
                  "Mexico",
                  "South Africa",
                  "Other",
                ]}
              />

              {/* Gender */}
              <SelectField
                id="gender"
                label="Gender"
                icon={<Globe className="h-5 w-5 text-gray-400" />}
                value={formData.gender}
                onChange={handleChange}
                options={["MALE", "FEMALE"]}
              />

              {/* Phone Number */}
              <Field
                id="phoneNumber"
                label="Phone Number"
                icon={<Phone className="h-5 w-5 text-gray-400" />}
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phoneNumber}
                onChange={handleChange}
              />

              {/* Password */}
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
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-black" />
                      ) : (
                        <Eye className="h-5 w-5 text-black" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters long.
                </p>
              </div>

              {/* Terms */}
              <div className="flex flex-col items-start space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    onChange={(e) => setRememberMe(e.target.checked)}
                    type="checkbox"
                    className="h-4 w-4 text-black border-gray-300 rounded"
                  />
                  <span className=" text-gray-600">Remember me</span>
                </label>

                <label htmlFor="terms" className="flex items-center space-x-2">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 border-gray-300 rounded text-black focus:ring-black"
                  />
                  I agree to the{" "}
                  <Link href={"#"} className="text-gray-600 font-medium ml-1">
                    Terms and Conditions
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors shadow-md"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>

              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <a
                  onClick={() => router.push("/pages/login")}
                  className="font-medium text-black cursor-pointer"
                >
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ id, label, icon, type, placeholder, value, onChange }: any) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={id}
          name={id}
          type={type}
          required
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
        />
      </div>
    </div>
  );
}

function SelectField({ id, label, icon, value, onChange, options }: any) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
