// app/admin/page.js
"use client";
import { useState } from "react";

export default function AdminPage() {
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState(null);

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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Admin - Ingest Daily Incident
        </h1>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Date</label>
            <input
              required
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
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
            <label className="block mb-1 font-medium text-gray-700">
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
            <label className="block mb-1 font-medium text-gray-700">
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
          <p className="mt-4 text-sm text-center text-gray-700">{status}</p>
        )}
      </div>
    </div>
  );
}
