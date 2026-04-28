"use client";

import { useState } from "react";
import Image from "next/image";
import { loginAction, signupAction } from "./actions";
import { Button } from "@/components/buttons/simpleButton";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(formData: FormData) {
    setIsLoading(true);
    setError("");
    const result = await loginAction(formData);
    if (result?.error) setError(result.error);
    setIsLoading(false);
  }

  async function handleSignup(formData: FormData) {
    setIsLoading(true);
    setError("");
    setSuccessMsg("");
    const result = await signupAction(formData);
    if (result?.error) setError(result.error);
    if (result?.success) setSuccessMsg(result.message);
    setIsLoading(false);
  }

  const inputClassName =
    "w-full p-2 bg-white border border-[#D8DBE8] rounded-md focus:ring-2 focus:ring-[#A67520]/30 focus:border-[#A67520] focus:outline-none text-sm text-[#0F1117] placeholder:text-[#5A6080] font-medium transition-colors";

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4 py-12 relative overflow-hidden"
      style={{
        backgroundImage: "url('/sign-up-background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Outer blur overlay */}
      <div className="absolute inset-0 backdrop-blur-glass-bg" />

      <div className="z-10 w-full max-w-6xl relative">
        <div
          className="border border-[#D8DBE8] rounded-2xl overflow-hidden relative z-20 shadow-2xl p-8 lg:p-12"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div className="flex flex-col md:flex-row md:min-h-140">
            {/* Left — decorative image */}
            <div className="hidden md:flex flex-1 items-center justify-center p-8 lg:p-12 relative w-full h-full min-h-[500px]">
              <Image
                src="/sign-up-element-chair.png"
                alt="Reading Chair"
                fill
                sizes="150vw"
                className="object-contain opacity-100"
              />
            </div>

            {/* Right — form */}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative min-h-125">
              {/* Logo */}
              <div className="h-20 mb-8 relative w-full">
                <Image
                  src="/site-logo-transparent.png"
                  alt="Site Logo"
                  fill
                  className="object-contain mx-auto"
                />
              </div>

              {/* Error / Success messages */}
              {error && (
                <div className="mb-4 p-3 bg-white text-[#C0392B] text-sm rounded-md border border-[#C0392B]/40">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="mb-4 p-3 bg-white text-[#A67520] text-sm rounded-md border border-[#A67520]/40">
                  {successMsg}
                </div>
              )}

              {isLogin ? (
                <form
                  action={handleLogin}
                  className="flex flex-col gap-5 max-w-sm mx-auto w-full h-95"
                  key="login"
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    autoComplete="email"
                    className={inputClassName}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    autoComplete="current-password"
                    className={inputClassName}
                  />
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="mt-2 mx-auto w-[65%] font-bold uppercase shadow-lg"
                    size="lg"
                  >
                    {isLoading ? "Signing in..." : "Login"}
                  </Button>
                  <div className="text-center mt-auto pt-2 text-sm text-[#0F1117] font-medium">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(false);
                        setError("");
                        setSuccessMsg("");
                      }}
                      className="text-[#A67520] hover:text-[#8A6018] hover:underline font-semibold bg-transparent border-none cursor-pointer"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              ) : (
                <form
                  action={handleSignup}
                  className="flex flex-col gap-5 max-w-sm mx-auto w-full h-95"
                  key="signup"
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    required
                    autoComplete="name"
                    className={inputClassName}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    autoComplete="email"
                    className={inputClassName}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password (min. 6 chars)"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className={inputClassName}
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className={inputClassName}
                  />
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="mt-2 mx-auto w-[65%] font-bold uppercase shadow-lg"
                    size="lg"
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                  <div className="text-center mt-auto pt-2 text-sm text-[#0F1117] font-medium">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(true);
                        setError("");
                        setSuccessMsg("");
                      }}
                      className="text-[#A67520] hover:text-[#8A6018] hover:underline font-semibold bg-transparent border-none cursor-pointer"
                    >
                      Login
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
