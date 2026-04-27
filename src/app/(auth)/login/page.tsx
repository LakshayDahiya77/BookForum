"use client";

import { useState } from "react";
import Image from "next/image";
import { loginAction, signupAction } from "./actions";
import ThemeToggle from "@/components/ThemeToggle";
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
    "w-full p-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-accent/30 focus:border-accent focus:outline-none text-sm text-text-primary placeholder:text-text-muted font-medium transition-colors";

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
      <div className="absolute inset-0 backdrop-blur-glass-bg" />
      <div className="z-10 w-full max-w-6xl relative backdrop-blur-glass-form">
        <div className="border border-border rounded-2xl overflow-hidden relative z-20 bg-glass shadow-2xl p-8 lg:p-12 ">
          <div className="absolute bottom-4 right-4 z-30">
            <ThemeToggle />
          </div>
          <div className="grid grid-cols-2 w-full relative border-b border-border hidden">
            <Button
              variant="ghost"
              onClick={() => {
                setIsLogin(true);
                setError("");
                setSuccessMsg("");
              }}
              className={`w-full h-auto py-4 text-sm font-bold transition-colors border-b-2 rounded-none rounded-t-2xl ${
                isLogin
                  ? "border-accent text-accent bg-background/5"
                  : "border-transparent text-text-muted hover:text-text-primary hover:bg-background/10"
              }`}
            >
              LOGIN
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsLogin(false);
                setError("");
                setSuccessMsg("");
              }}
              className={`w-full h-auto py-4 text-sm font-bold transition-colors border-b-2 rounded-none rounded-t-2xl ${
                !isLogin
                  ? "border-accent text-accent bg-background/5"
                  : "border-transparent text-text-muted hover:text-text-primary hover:bg-background/10"
              }`}
            >
              SIGN UP
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:min-h-140 ">
            <div className="hidden md:flex flex-1 items-center justify-center p-8 lg:p-12 relative w-full h-full min-h-[300px]">
              <Image
                src="/sign-up-element-chair.png"
                alt="Reading Chair"
                fill
                sizes="50vw"
                className="object-contain opacity-100"
              />
            </div>

            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative min-h-125">
              <div className="h-20 mb-8 relative w-full">
                <Image
                  src="/site-logo-transparent.png"
                  alt="Site Logo"
                  fill
                  className="object-contain mx-auto"
                />
              </div>
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

                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="mt-2 mx-auto w-[65%] font-bold uppercase shadow-lg"
                    size="lg"
                  >
                    {isLoading ? "Signing in..." : "LOGIN"}
                  </Button>
                  <div className="text-center mt-auto pt-2 text-sm text-text-primary font-medium">
                    Don&apos;t have an account?{" "}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsLogin(false)}
                      className="text-accent hover:text-accent-hover hover:underline font-semibold p-0 h-auto bg-transparent hover:bg-transparent"
                    >
                      Sign up
                    </Button>
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

                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="mt-2 mx-auto w-[65%] font-bold uppercase shadow-lg"
                    size="lg"
                  >
                    {isLoading ? "Creating account..." : "SIGN UP"}
                  </Button>
                  <div className="text-center mt-auto pt-2 text-sm text-text-primary font-medium">
                    Already have an account?{" "}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsLogin(true)}
                      className="text-accent hover:text-accent-hover hover:underline font-semibold p-0 h-auto bg-transparent hover:bg-transparent"
                    >
                      Login
                    </Button>
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
