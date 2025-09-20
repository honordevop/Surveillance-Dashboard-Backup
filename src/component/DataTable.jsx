"use client";

export default function DataTable({ sites, assets }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-xl border overflow-hidden">
        <div className="p-3 border-b font-medium">Illegal Sites</div>
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
              {sites.length === 0 && (
                <tr>
                  <td className="p-2 text-gray-500" colSpan={4}>
                    No sites
                  </td>
                </tr>
              )}
              {sites.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-2">{formatCategory(s.category)}</td>
                  <td className="p-2">{s.location}</td>
                  <td className="p-2">{s.lat}</td>
                  <td className="p-2">{s.lng}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="p-3 border-b font-medium">Burnt Seized Assets</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {assets?.length === 0 && (
                <tr>
                  <td className="p-2 text-gray-500" colSpan={2}>
                    No assets
                  </td>
                </tr>
              )}
              {assets?.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-2">{a.name}</td>
                  <td className="p-2">{a.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function formatCategory(c) {
  if (c === "ILLEGAL_CONNECTION") return "Illegal Connection";
  if (c === "ILLEGAL_REFINERY") return "Illegal Refinery";
  return "Other";
}
