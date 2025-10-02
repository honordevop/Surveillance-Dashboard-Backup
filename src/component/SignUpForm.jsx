"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import Link from "next/link";

export default function SignupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // timed loader to avoid infinite spinner (6s fallback)
  const [timedLoading, setTimedLoading] = useState(false);
  const timeoutRef = useRef(null);

  const startTimedLoader = () => {
    clearTimedLoader();
    setTimedLoading(true);
    timeoutRef.current = setTimeout(() => {
      setTimedLoading(false);
    }, 6000);
  };
  const clearTimedLoader = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setTimedLoading(false);
  };

  // redirect admin users away from signup
  useEffect(() => {
    if (status === "loading") {
      startTimedLoader();
      return;
    }

    clearTimedLoader();

    if (status === "authenticated" && session?.user?.role === "admin") {
      router.push("/home");
    }

    return () => clearTimedLoader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

  const loaderTime = () => {
    setTimedLoading(true);
    setTimeout(() => {
      setTimedLoading(false);
    }, 5000);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    startTimedLoader();

    try {
      const form = new FormData(e.currentTarget);
      const payload = {
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        corridor: form.get("corridor"),
        role: form.get("role"),
      };
      console.log(payload);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      clearTimedLoader();
      setSubmitting(false);

      if (!res.ok) {
        setError(data.error || "Signup failed");
        toast(data.error || "Signup failed");

        return;
      }

      setSuccess("Account created! Proceed to login.");
      toast("Account created! Proceed to login.");
      clearTimedLoader();
    } catch (err) {
      console.error("[signup]", err);
      setError(err?.message || "Unexpected error");
      toast(err?.message || "Unexpected error");
      clearTimedLoader();
      setSubmitting(false);
    }
  }

  // show loader if checking session or submitting
  const showLoader = status === "loading" || submitting || timedLoading;

  return (
    <div className="flex items-center justify-center h-full bg-graye-100 px-4 mt-5">
      <div className="w-full max-w-md p-6 bg-whiteg rounded-2xl shadow ">
        <div className="mb-4">
          <h1 className="text-2xl font-bold ">Sign Up</h1>
          <em>Create account for dashboard Administrator</em>
        </div>

        {showLoader ? (
          <div className="flex flex-col items-center justify-center py-8 ">
            <BeatLoader size={14} />
            <div className="mt-3 text-sm text-gray-500">
              {status === "loading"
                ? "Checking session..."
                : submitting
                ? "Creating account..."
                : "Loading..."}
            </div>
          </div>
        ) : (
          <>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {success && (
              <p className="text-green-600 text-sm mb-2">{success}</p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {/* <label htmlFor="name"> Name</label> */}
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                required
                className="w-full mb-1 p-2 border rounded"
              />
              {/* <label htmlFor="email"> Email </label> */}
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="w-full mb-1 p-2 border rounded"
              />
              {/* <label htmlFor="password"> Password</label> */}
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                className="w-full mb-1 p-2 border rounded"
              />
              {/* <label htmlFor="corridor"> Corridor </label> */}
              <input
                name="corridor"
                type="text"
                placeholder="Corridor"
                required
                className="w-full mb-1 p-2 border rounded"
              />
              {/* <label htmlFor="role"> Role</label> */}
              <select
                name="role"
                required
                className="w-full mb-1 p-2 border rounded"
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                {/* <option value="superadmin">Super Admin</option> */}
              </select>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Creating account..." : "Sign Up"}
              </button>
            </form>
            <div className="my-2 text-center text-sm w-full italic">
              <Link href="/" className="">
                Click here to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
