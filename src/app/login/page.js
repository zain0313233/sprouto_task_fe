"use client";
import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
const Main = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const { login } = useUser();
  const router = useRouter();

  const validator = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: ""
      }));
    }
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData
    };
    setFormData(updatedFormData);

    if (!validator()) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      email: updatedFormData.email,
      password: updatedFormData.password
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
        payload,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const { userdata ,token } = response.data;
      
      const data = response.data;

      if (data.status === 'success' && data.token) {
        login(userdata,token)
        // console.log('userdata',userdata)
        // console.log('token',token)
       
        router.push("/");
      } else {
        throw new Error("Login failed. Please check your credentials.");
      }

      console.log("Success:", data);
      alert("Login successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen">
      <div className="flex-1  bg-gray-700 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gray-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-600/20 rounded-full blur-3xl" />

        <div className="flex flex-col items-center justify-center h-full text-center relative z-10 px-12">
          <h1 className="text-5xl font-bold text-white mb-6">
            Welcome to Our Platform
          </h1>
          
        </div>
      </div>

      <div className="flex-1 max-w-lg bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Login to Your Account
            </h2>
            <p className="text-gray-600">Fill in your details to get started</p>
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white hover:bg-white"
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1 font-medium ">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white hover:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.password && (
                <p className="text-red-600 text-xs mt-1 font-medium">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Loging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            <div className="text-center text-sm text-gray-600 space-y-2">
              <p>
                Don’t have an account?
                <a
                  href="/"
                  className="text-blue-600 hover:text-blue-700 font-medium ml-1 hover:underline"
                >
                  Sign Up
                </a>
              </p>
              <p>
                Forgot your password?
                <button
                  className="ml-1 text-blue-600 hover:text-blue-700 font-medium "
                >
                  Click here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Main;
