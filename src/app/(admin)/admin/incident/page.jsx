"use client";

import { useGlobalContext } from "@/context/context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RotatingSquare, Watch } from "react-loader-spinner";
import { BounceLoader } from "react-spinners";

const EMPTY_SITE = {
  category: "ILLEGAL_CONNECTION",
  location: "",
  lat: "",
  lng: "",
};
const EMPTY_ASSET = { name: "", notes: "" };
const EMPTY_LEAK = { category: "Oil Leakage", location: "", lat: "", lng: "" };

export default function AdminIncidentPage() {
  const { data: session, status: sessionStatus } = useSession();
  const { pageLoading, offPageLoading, mode } = useGlobalContext();
  const router = useRouter();

  // console.log(session?.user);

  // redirect admin users away from signup

  useEffect(() => {
    if (sessionStatus === "loading") {
      // setPageLoading(true);
    }

    if (
      sessionStatus === "unauthenticated" ||
      session?.user?.role !== "admin"
    ) {
      router.push("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStatus, session]);

  useEffect(() => {
    if (session?.user) {
      offPageLoading();
    }
  }, [session?.user]);

  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    illegalConnections: 0,
    illegalRefineries: 0,
    oilLeaks: 0,
    gasLeaks: 0,
    arrestsMade: 0,
    aversions: 0,
    litersAGO: 0,
    litersPMS: 0,
    litersCrude: 0,
    illegalSites: [{ ...EMPTY_SITE }],
    burntAssets: [{ ...EMPTY_ASSET }],
    leakageSites: [{ ...EMPTY_LEAK }],
  });
  const [status, setStatus] = useState(null);

  // Images state
  const [selectedFiles, setSelectedFiles] = useState([]); // [{file, caption}]
  const [uploadStatus, setUploadStatus] = useState(null);
  const [existingImages, setExistingImages] = useState([]); // {id, caption, signedUrl}

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200";

  // Load existing images for the selected month
  async function refreshReport() {
    try {
      const res = await fetch(
        `/api/incident/report?year=${form.year}&month=${form.month}`
      );
      const json = await res.json();
      if (json.ok && json.data) {
        setExistingImages(json.data.operationImages || []);
      } else {
        setExistingImages([]);
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    refreshReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.year, form.month]);

  const setField = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  // Illegal sites CRUD
  const addSite = () =>
    setForm((p) => ({
      ...p,
      illegalSites: [...p.illegalSites, { ...EMPTY_SITE }],
    }));
  const removeSite = (i) =>
    setForm((p) => ({
      ...p,
      illegalSites: p.illegalSites.filter((_, idx) => idx !== i),
    }));
  const updateSite = (i, key, val) =>
    setForm((p) => {
      const arr = [...p.illegalSites];
      arr[i] = { ...arr[i], [key]: val };
      return { ...p, illegalSites: arr };
    });

  // Burnt assets CRUD
  const addAsset = () =>
    setForm((p) => ({
      ...p,
      burntAssets: [...p.burntAssets, { ...EMPTY_ASSET }],
    }));
  const removeAsset = (i) =>
    setForm((p) => ({
      ...p,
      burntAssets: p.burntAssets.filter((_, idx) => idx !== i),
    }));
  const updateAsset = (i, key, val) =>
    setForm((p) => {
      const arr = [...p.burntAssets];
      arr[i] = { ...arr[i], [key]: val };
      return { ...p, burntAssets: arr };
    });

  // Leakage sites CRUD
  const addLeak = () =>
    setForm((p) => ({
      ...p,
      leakageSites: [...p.leakageSites, { ...EMPTY_LEAK }],
    }));
  const removeLeak = (i) =>
    setForm((p) => ({
      ...p,
      leakageSites: p.leakageSites.filter((_, idx) => idx !== i),
    }));
  const updateLeak = (i, key, val) =>
    setForm((p) => {
      const arr = [...p.leakageSites];
      arr[i] = { ...arr[i], [key]: val };
      return { ...p, leakageSites: arr };
    });

  // Save metrics/sites/assets/leaks (JSON)
  const submit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    const payload = {
      ...form,
      year: Number(form.year),
      month: Number(form.month),
      illegalConnections: Number(form.illegalConnections),
      illegalRefineries: Number(form.illegalRefineries),
      oilLeaks: Number(form.oilLeaks),
      gasLeaks: Number(form.gasLeaks),
      arrestsMade: Number(form.arrestsMade),
      aversions: Number(form.aversions),
      litersAGO: Number(form.litersAGO),
      litersPMS: Number(form.litersPMS),
      litersCrude: Number(form.litersCrude),
      illegalSites: form.illegalSites
        .filter((s) => s.location && s.category)
        .map((s) => ({ ...s, lat: Number(s.lat), lng: Number(s.lng) })),
      burntAssets: form.burntAssets.filter((a) => a.name),
      leakageSites: form.leakageSites
        .filter((s) => s.location && s.category)
        .map((s) => ({ ...s, lat: Number(s.lat), lng: Number(s.lng) })),
    };

    try {
      const res = await fetch("/api/incident/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed");
      setStatus("Saved successfully ✅");
      await refreshReport();
    } catch (err) {
      console.error(err);
      setStatus("Error saving. Check console.");
    } finally {
      setTimeout(() => setStatus(null), 4000);
    }
  };

  // Handle image file select (multi)
  const onPickFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const enriched = files.map((file) => ({ file, caption: "" }));
    setSelectedFiles(enriched);
  };
  const setCaption = (idx, val) =>
    setSelectedFiles((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], caption: val };
      return next;
    });

  // Upload selected images via server API (private bucket)
  const uploadImages = async () => {
    if (!selectedFiles.length) return;
    setUploadStatus("Uploading...");
    try {
      const fd = new FormData();
      selectedFiles.forEach(({ file, caption }) => {
        fd.append("files", file, file.name);
        fd.append("captions", caption || "");
      });

      const res = await fetch(
        `/api/incident/images?year=${form.year}&month=${form.month}`,
        {
          method: "POST",
          body: fd,
        }
      );
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Upload failed");

      setSelectedFiles([]);
      setUploadStatus("Uploaded ✅");
      await refreshReport();
    } catch (e) {
      console.error(e);
      setUploadStatus("Upload error — see console.");
    } finally {
      setTimeout(() => setUploadStatus(null), 4000);
    }
  };

  const deleteImage = async (id) => {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await fetch(`/api/incident/images?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Delete failed");
      await refreshReport();
    } catch (e) {
      console.error(e);
      alert("Delete failed. See console.");
    }
  };

  // Show Page Loading before when confirming user data and authentication status
  if (pageLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div>
          {/* <BounceLoader className="" size={80} color="#b52624" /> */}
          <RotatingSquare
            visible={true}
            height="150"
            width="150"
            color={mode === "dark" ? "#ffff" : "#010e23"}
            ariaLabel="rotating-square-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      </div>
    );
  }

  // Show Admin Dashboard Content
  if (sessionStatus === "authenticated" && session?.user?.role === "admin") {
    return (
      <div className="max-w-6xl mx-auto mt-[14vh] p-6 space-y-8">
        <div className="w-full flex flex-col items-center justify-center glassMorphism py-5">
          <h1 className="text-2xl font-semibold">
            Monthly Incident Report Entry Admin Dashboard
          </h1>
          <p>Welcome {session?.user?.name}</p>
          <p>Corridor: {session?.user?.corridor}</p>
        </div>

        {/* Base form */}
        <form onSubmit={submit} className="space-y-8">
          {/* Year/Month + KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm mb-1">Year</label>
              <input
                className={inputClass}
                type="number"
                value={form.year}
                onChange={(e) => setField("year", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Month (1-12)</label>
              <select
                className={inputClass}
                value={form.month}
                onChange={(e) => setField("month", e.target.value)}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {[
              ["illegalConnections", "Illegal Connections"],
              ["illegalRefineries", "Illegal Refineries"],
              ["oilLeaks", "Oil Leaks"],
              ["gasLeaks", "Gas Leaks"],
              ["arrestsMade", "Arrests Made"],
              ["aversions", "Aversions"],
            ].map(([k, label]) => (
              <div key={k}>
                <label className="block text-sm mb-1">{label}</label>
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  value={form[k]}
                  onChange={(e) => setField(k, e.target.value)}
                />
              </div>
            ))}

            {[
              ["litersAGO", "Liters AGO"],
              ["litersPMS", "Liters PMS"],
              ["litersCrude", "Liters Crude"],
            ].map(([k, label]) => (
              <div key={k}>
                <label className="block text-sm mb-1">{label}</label>
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  step="any"
                  value={form[k]}
                  onChange={(e) => setField(k, e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Illegal Sites */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Illegal Sites</h2>
              <button
                type="button"
                onClick={addSite}
                className="px-3 py-1 rounded-lg bg-blue-600 text-white"
              >
                Add Site
              </button>
            </div>
            <div className="space-y-4">
              {form.illegalSites.map((s, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end border p-3 rounded-xl"
                >
                  <div>
                    <label className="block text-sm mb-1">Category</label>
                    <select
                      className={inputClass}
                      value={s.category}
                      onChange={(e) =>
                        updateSite(i, "category", e.target.value)
                      }
                    >
                      <option value="ILLEGAL_CONNECTION">
                        Illegal Connection
                      </option>
                      <option value="ILLEGAL_REFINERY">Illegal Refinery</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1">Location</label>
                    <input
                      className={inputClass}
                      value={s.location}
                      onChange={(e) =>
                        updateSite(i, "location", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Lat</label>
                    <input
                      className={inputClass}
                      type="number"
                      step="any"
                      value={s.lat}
                      onChange={(e) => updateSite(i, "lat", e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Lng</label>
                      <input
                        className={inputClass}
                        type="number"
                        step="any"
                        value={s.lng}
                        onChange={(e) => updateSite(i, "lng", e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSite(i)}
                      className="h-10 px-3 rounded-lg bg-red-600 text-white"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leakage Sites */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Oil/Gas Leakage Sites</h2>
              <button
                type="button"
                onClick={addLeak}
                className="px-3 py-1 rounded-lg bg-blue-600 text-white"
              >
                Add Leakage Site
              </button>
            </div>
            <div className="space-y-4">
              {form.leakageSites.map((s, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end border p-3 rounded-xl"
                >
                  <div>
                    <label className="block text-sm mb-1">Category</label>
                    <select
                      className={inputClass}
                      value={s.category}
                      onChange={(e) =>
                        updateLeak(i, "category", e.target.value)
                      }
                    >
                      <option value="Oil Leakage">Oil Leakage</option>
                      <option value="Gas Leakage">Gas Leakage</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1">Location</label>
                    <input
                      className={inputClass}
                      value={s.location}
                      onChange={(e) =>
                        updateLeak(i, "location", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Lat</label>
                    <input
                      className={inputClass}
                      type="number"
                      step="any"
                      value={s.lat}
                      onChange={(e) => updateLeak(i, "lat", e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Lng</label>
                      <input
                        className={inputClass}
                        type="number"
                        step="any"
                        value={s.lng}
                        onChange={(e) => updateLeak(i, "lng", e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLeak(i)}
                      className="h-10 px-3 rounded-lg bg-red-600 text-white"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Burnt Assets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Burnt Seized Assets</h2>
              <button
                type="button"
                onClick={addAsset}
                className="px-3 py-1 rounded-lg bg-blue-600 text-white"
              >
                Add Asset
              </button>
            </div>
            <div className="space-y-4">
              {form.burntAssets.map((a, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end border p-3 rounded-xl"
                >
                  <div>
                    <label className="block text-sm mb-1">Name</label>
                    <input
                      className={inputClass}
                      value={a.name}
                      onChange={(e) => updateAsset(i, "name", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1">Notes</label>
                    <input
                      className={inputClass}
                      value={a.notes}
                      onChange={(e) => updateAsset(i, "notes", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-3 text-right">
                    <button
                      type="button"
                      onClick={() => removeAsset(i)}
                      className="px-3 py-1 rounded-lg bg-red-600 text-white"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-600 text-white"
            >
              Save
            </button>
            {status && <span className="text-sm text-gray-600">{status}</span>}
          </div>
        </form>

        {/* Operations Images (Month) */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Operations Images (Month)</h2>
          <div className="rounded-xl border p-4 space-y-3">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={onPickFiles}
              className="block w-full text-sm"
            />

            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedFiles.map((it, idx) => (
                  <div key={idx} className="border rounded-lg p-2">
                    <img
                      src={URL.createObjectURL(it.file)}
                      alt={it.file.name}
                      className="w-full h-40 object-cover rounded"
                    />
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Caption (optional)"
                        value={it.caption}
                        onChange={(e) => setCaption(idx, e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={uploadImages}
                disabled={selectedFiles.length === 0}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
              >
                Upload Images for {form.year}-
                {String(form.month).padStart(2, "0")}
              </button>
              {uploadStatus && (
                <span className="text-sm text-gray-600">{uploadStatus}</span>
              )}
            </div>

            <div className="mt-4">
              <h3 className="font-medium mb-2">Existing Images</h3>
              {existingImages.length === 0 && (
                <div className="text-sm text-gray-500">
                  No images uploaded for this month yet.
                </div>
              )}
              {existingImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((img) => (
                    <div key={img.id} className="border rounded-lg p-2">
                      {/* Use signedUrl from GET /api/incident/report */}
                      {img.signedUrl ? (
                        <img
                          src={img.signedUrl}
                          alt={img.caption || "Operation"}
                          className="w-full h-32 object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                          No preview
                        </div>
                      )}
                      <div className="mt-2 text-xs text-gray-600 truncate">
                        {img.caption || "—"}
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteImage(img.id)}
                        className="mt-2 w-full px-2 py-1 text-sm rounded bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
