'use client';

import { useEffect, useMemo, useState } from 'react';
import { monthName, fmt } from '../../../utils/format';
import MonthYearPicker from '@/component/MonthYearPicker';
import KpiCard from '@/component/KpiCard';
import BarCard from '@/component/BarCard';
import LiquidsChart from '@/component/LiquidsChart';
import DataTable from '@/component/DataTable';
// import IncidentMap from '@/component/IncidentMap';
import ImageGallery from '@/component/ImageGallery';
import dynamic from "next/dynamic";

// Dynamically load the IncidentMap so it only runs in browser
const IncidentMap = dynamic(() => import("@/component/IncidentMap"), {
  ssr: false,
});

export default function IncidentDashboardPage() {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null); // {year, month}
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/incident/months');
      const json = await res.json();
      if (json.ok) {
        setOptions(json.data || []);
        if (json.data && json.data.length > 0) {
          setSelected(json.data[0]); // latest
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (!selected) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/incident/report?year=${selected.year}&month=${selected.month}`);
        const json = await res.json();
        setData(json.data);
      } catch (e) {
        console.error(e);
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [selected]);

  console.log(data)
  const report = data?.report || null;
  const hasData = !!report;

  const pairData = useMemo(() => {
    if (!report) return [];
    return [
      { label: 'Illegal Connections', value: report.illegalConnections },
      { label: 'Illegal Refineries', value: report.illegalRefineries },
    ];
  }, [report]);

  const liquidsData = useMemo(() => {
    if (!report) return [];
    return [
      { name: 'AGO', value: report.litersAGO },
      { name: 'PMS', value: report.litersPMS },
      { name: 'Crude', value: report.litersCrude },
    ];
  }, [report]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold">Incident Report Dashboard</h1>
        <MonthYearPicker
          options={options}
          value={selected}
          onChange={setSelected}
        />
      </div>

      {selected && (
        <p className="text-gray-600">
          Showing: <span className="font-medium">{monthName(selected.month)} {selected.year}</span>
        </p>
      )}

      {loading && <div className="text-gray-600">Loading...</div>}

      {!loading && !hasData && (
        <div className="rounded-xl border p-6 text-gray-600">
          No data for the selected month.
        </div>
      )}

      {!loading && hasData && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard title="Illegal Connections" value={fmt(report.illegalConnections)} />
            <KpiCard title="Illegal Refineries" value={fmt(report.illegalRefineries)} />
            <KpiCard title="Oil Leaks" value={fmt(report.oilLeaks)} />
            <KpiCard title="Gas Leaks" value={fmt(report.gasLeaks)} />
            <KpiCard title="Arrests Made" value={fmt(report.arrestsMade)} />
            <KpiCard title="Aversions" value={fmt(report.aversions)} />
            <KpiCard title="Liters AGO" value={fmt(report.litersAGO)} />
            <KpiCard title="Liters PMS" value={fmt(report.litersPMS)} />
            <KpiCard title="Liters Crude" value={fmt(report.litersCrude)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarCard title="Illegal Connections vs. Refineries" data={pairData} />
            <LiquidsChart title="Recovered Volumes (Liters)" data={liquidsData} />
          </div>

          {/* Tables */}
          <DataTable
            sites={data.illegalSites || []}
            assets={data.burntAssets || []}
          />

          {/* Leakage Sites table */}
          <div className="rounded-xl border overflow-hidden">
            <div className="p-3 border-b font-medium">Oil/Gas Leakage Sites</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2">Category</th>
                    <th className="text-left p-2">Location</th>
                    <th className="text-left p-2">Lat</th>
                    <th className="text-left p-2">Lng</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.leakageSites || []).length === 0 && (
                    <tr><td className="p-2 text-gray-500" colSpan={4}>No leakage sites</td></tr>
                  )}
                  {(data.leakageSites || []).map((s) => (
                    <tr key={s.id} className="border-t">
                      <td className="p-2">{s.category}</td>
                      <td className="p-2">{s.location}</td>
                      <td className="p-2">{s.lat}</td>
                      <td className="p-2">{s.lng}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Map */}
          <IncidentMap illegalSites={data.illegalSites || []} leakageSites={data.leakageSites || []} />

          {/* Images gallery */}
          <h2 className="text-xl font-bold mt-10">Operations Images</h2>
          <ImageGallery images={data.operationImages} />
        </>
      )}
    </div>
  );
}
