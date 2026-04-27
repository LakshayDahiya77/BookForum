"use client";

import { useState } from "react";
import { loginAction, signupAction } from "./actions";
import ThemeToggle from "@/components/ThemeToggle";

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
    "w-full p-3 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent/30 focus:border-accent focus:outline-none text-sm text-text-primary placeholder:text-text-muted font-medium transition-colors";

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4 py-12 relative overflow-hidden"
      style={{
        backgroundImage: "url('/sign-up-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 backdrop-blur-glass-bg" />
      <div className="z-10 w-full max-w-6xl relative backdrop-blur-glass-form">
        <img
          src="/site-logo-transparent.png"
          alt="Site Logo"
          className="h-16 object-contain mb-8 mx-auto"
        />
        <div className="border border-border rounded-2xl overflow-hidden relative z-20 bg-glass shadow-2xl">
          <div className="absolute bottom-4 right-4 z-30">
            <ThemeToggle />
          </div>
          <div className="grid grid-cols-2 w-full relative border-b border-border">
            <button
              onClick={() => {
                setIsLogin(true);
                setError("");
                setSuccessMsg("");
              }}
              className={`w-full py-4 text-sm font-bold transition-colors border-b-2 ${
                isLogin
                  ? "border-accent text-accent"
                  : "border-transparent text-text-muted hover:text-text-primary"
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
              className={`w-full py-4 text-sm font-bold transition-colors border-b-2 ${
                !isLogin
                  ? "border-accent text-accent"
                  : "border-transparent text-text-muted hover:text-text-primary"
              }`}
            >
              SIGN UP
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:min-h-140 ">
            <div className="hidden md:flex flex-1 items-center justify-center p-4 lg:p-6 ">
              <img
                src="/sign-up-element-chair.png"
                alt="Reading Chair"
                className="w-full max-w-105 object-contain opacity-90"
              />
            </div>

            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative min-h-125">
              {error && (
                <div className="mb-4 p-3 bg-surface text-danger text-sm rounded-md border border-danger/40">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="mb-4 p-3 bg-surface text-accent text-sm rounded-md border border-accent/40">
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
                    className="mt-2 mx-auto w-[65%] bg-accent hover:bg-accent-hover text-background font-bold py-3 rounded-md uppercase transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Signing in..." : "LOGIN"}
                  </button>
                  <div className="text-center mt-auto pt-2 text-sm text-text-primary font-medium">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsLogin(false)}
                      className="text-accent hover:underline font-semibold"
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
                    className="mt-2 mx-auto w-[65%] bg-accent hover:bg-accent-hover text-background font-bold py-3 rounded-md uppercase transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Creating account..." : "SIGN UP"}
                  </button>
                  <div className="text-center mt-auto pt-2 text-sm text-text-primary font-medium">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className="text-accent hover:underline font-semibold"
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
