"use client";

import { useState } from "react";
import { loginAction, signupAction } from "./actions";

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

  // Inactive inputs stay white; focused input shifts to warm tone.
  const inputClassName =
    "w-full p-3 bg-white/95 border border-transparent rounded-md focus:bg-[#FCFCE4] focus:ring-2 focus:ring-[#8E3B68]/45 focus:border-[#8E3B68]/35 focus:outline-none text-sm text-gray-800 placeholder-gray-400 font-medium transition-colors";

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center p-4 py-12 relative"
      style={{ backgroundImage: "url('/sign-up-background.jpg')" }}
    >
      {/* Heavy Blur Overlay for the Background to achieve glassmorphism outer look */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-md" />

      {/* Z-index keeps content above the blurred background */}
      <div className="z-10 w-full max-w-4xl relative">
        {/* Main Glass Card */}
        <div className="bg-white/70 backdrop-blur-xl border-2 border-t-0 border-white/80 rounded-2xl overflow-hidden relative z-20">
          {/* Tabs stay inside the card and split width equally */}
          <div className="grid grid-cols-2 w-full relative">
            <div
              className={`pointer-events-none absolute bottom-0 h-0.5 bg-white/80 transition-all ${
                isLogin ? "left-1/2 right-0" : "left-0 right-1/2"
              }`}
            />
            <button
              onClick={() => {
                setIsLogin(true);
                setError("");
                setSuccessMsg("");
              }}
              className={`w-full py-4 text-sm font-bold transition-colors border-t-2 border-r-2 ${
                isLogin
                  ? "bg-transparent text-gray-900 border-t-white/80 border-r-white/80 rounded-tl-2xl"
                  : "bg-white/25 text-gray-600 hover:bg-white/35 border-transparent"
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
                setSuccessMsg("");
              }}
              className={`w-full py-4 text-sm font-bold transition-colors border-t-2 border-l-2 ${
                !isLogin
                  ? "bg-transparent text-gray-900 border-t-white/80 border-l-white/80 rounded-tr-2xl"
                  : "bg-white/25 text-gray-600 hover:bg-white/35 border-transparent"
              }`}
            >
              SIGN UP
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:min-h-140">
            {/* Left Form Area */}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative min-h-125">
              <img
                src="/site-logo-transparent.png"
                alt="Site Logo"
                className="h-16 object-contain mx-auto mb-10 drop-shadow-sm"
              />

              {error && (
                <div className="mb-4 p-3 bg-red-100/90 backdrop-blur-sm text-red-700 text-sm rounded-md border border-red-200/50">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="mb-4 p-3 bg-green-100/90 backdrop-blur-sm text-green-800 text-sm rounded-md border border-green-200/50">
                  {successMsg}
                </div>
              )}

              {isLogin ? (
                <form
                  action={handleLogin}
                  className="flex flex-col gap-5 max-w-sm mx-auto w-full h-95"
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className={inputClassName}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    className={inputClassName}
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 mx-auto w-[65%] bg-[#833b5c] hover:bg-[#6b2f4a] text-white font-bold py-3 rounded-md uppercase transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Signing in..." : "LOGIN"}
                  </button>
                  <div className="text-center mt-auto pt-2 text-sm text-gray-800 font-medium">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsLogin(false)}
                      className="text-blue-700 hover:underline font-semibold"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              ) : (
                <form
                  action={handleSignup}
                  className="flex flex-col gap-5 max-w-sm mx-auto w-full h-95"
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    required
                    className={inputClassName}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className={inputClassName}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password (min. 6 chars)"
                    required
                    minLength={6}
                    className={inputClassName}
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required
                    minLength={6}
                    className={inputClassName}
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 mx-auto w-[65%] bg-[#833b5c] hover:bg-[#6b2f4a] text-white font-bold py-3 rounded-md uppercase transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Creating account..." : "SIGN UP"}
                  </button>
                  <div className="text-center mt-auto pt-2 text-sm text-gray-800 font-medium">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className="text-blue-700 hover:underline font-semibold"
                    >
                      Login
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Image Area */}
            <div className="hidden md:flex flex-1 items-center justify-center p-4 lg:p-6">
              <img
                src="/sign-up-element-chair.png"
                alt="Reading Chair"
                className="w-full max-w-105 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
