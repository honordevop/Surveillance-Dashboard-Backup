"use client";

import { useState, useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false); // form-submit loader
  const [error, setError] = useState("");

  // timed loader controller (to avoid infinite loader)
  const [timedLoading, setTimedLoading] = useState(false);
  const timeoutRef = useRef(null);

  // start / stop timed loader (6s fallback)
  const startTimedLoader = () => {
    clearTimedLoader();
    setTimedLoading(true);
    timeoutRef.current = setTimeout(() => {
      setTimedLoading(false);
    }, 6000); // 6s fallback
  };
  const clearTimedLoader = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setTimedLoading(false);
  };

  // Redirect if logged in as admin
  useEffect(() => {
    // When NextAuth is still resolving, show loader briefly
    if (status === "loading") {
      startTimedLoader();
      return;
    }

    clearTimedLoader();

    if (status === "authenticated" && session?.user?.role === "admin") {
      router.push("/home");
    }
    // cleanup on unmount
    return () => clearTimedLoader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    startTimedLoader();

    try {
      const form = new FormData(e.currentTarget);
      const email = form.get("email");
      const password = form.get("password");

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      // stop loader on result
      clearTimedLoader();
      setSubmitting(false);

      if (result?.error) {
        setError(result.error || "Login failed");
        toast(result.error || "Login failed");
        return;
      }

      // success -> route to admin incident
      router.push("/home");
    } catch (err) {
      console.error("[login]", err);
      setError(err?.message || "Unexpected error");
      toast(err?.message || "Unexpected error");
      clearTimedLoader();
      setSubmitting(false);
    }
  }

  // UI: show loader if NextAuth is checking session OR form is submitting
  const showLoader = status === "loading" || submitting || timedLoading;

  return (
    <div className="flex items-center justify-center h-full bg-grayd-100 px-4">
      <div className="w-full max-w-md p-6 bg-whited rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-14 text-center">
          Western Corridor Pipeline Incident Management System
        </h1>
        <h1 className="text-2xl font-bold mb-14">Administrator Login</h1>

        {showLoader ? (
          <div className="flex flex-col items-center justify-center py-8">
            <BeatLoader size={14} />
            <div className="mt-3 text-sm text-gray-500">
              {status === "loading"
                ? "Checking session..."
                : submitting
                ? "Signing in..."
                : "Loading..."}
            </div>
          </div>
        ) : (
          <>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <form
              onSubmit={handleSubmit}
              className="space-y-3 flex flex-col gap-3"
            >
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="w-full mb-1 p-2 border rounded"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                className="w-full mb-1 p-2 border rounded"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Signing in..." : "Login"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
