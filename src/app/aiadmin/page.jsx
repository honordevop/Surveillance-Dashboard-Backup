// app/admin/page.js
"use client";
import { useGlobalContext } from "@/context/context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Watch } from "react-loader-spinner";

export default function AdminPage() {
  const { data: session, status: sessionStatus } = useSession();
  const { pageLoading, offPageLoading, mode } = useGlobalContext();
  const router = useRouter();

  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (session?.user) {
      offPageLoading();
    }
  }, [session?.user]);

  useEffect(() => {
    if (status === "unauthenticated" || session?.user?.role !== "admin") {
      router.push("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

  if (pageLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center absolute top-0 left-0 -z-40">
        <div>
          {/* <BounceLoader className="" size={80} color="#b52624" />
           */}
          <Watch
            visible={true}
            height="150"
            width="150"
            radius="75"
            color="#3B82F6"
            ariaLabel="watch-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          location,
          incidentType: incidentType,
          details,
        }),
      });
      const entry = {
        data: date,
        location: location,
        incidentType: incidentType,
        details: details,
      };
      //   console.log(entry);
      const json = await res.json();
      if (res.ok) {
        setStatus("✅ Success: " + json.reportId);
        setDate("");
        setLocation("");
        setIncidentType("");
        setDetails("");
      } else {
        setStatus("❌ Error: " + (json.error || res.statusText));
      }
    } catch (err) {
      setStatus("❌ Error: " + String(err));
    }
  }

  return (
    <div className="min-h-screen bg-grayy-100 p-8 mt-[14vh]">
      <div className="max-w-xl mx-auto bg-whitee p-6 rounded shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Admin - Ingest Daily Incident
        </h1>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="block mb-1 font-medium text-grayy-700">
              Date
            </label>
            <input
              required
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-grayy-700">
              Location
            </label>
            <input
              required
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-grayy-700">
              Incident Type
            </label>
            <input
              required
              type="text"
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-grayy-700">
              Details
            </label>
            <textarea
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
        {status && (
          <p className="mt-4 text-sm text-center text-grayy-700">{status}</p>
        )}
      </div>
    </div>
  );
}
