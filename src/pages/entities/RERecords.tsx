import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, MapPin, List } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { EntityStatusBadge } from '../../components/entities/EntityStatusBadge';
import { EntityTypeTag } from '../../components/entities/EntityTypeTag';
import { MapView } from '../../components/entities/MapView';
import { useReRecords } from '../../hooks/useReRecords';

export default function RERecords() {
  const [page, setPage] = useState(0);
  const [view, setView] = useState<'list' | 'map'>('list');
  const { data, isLoading } = useReRecords({ page, size: 20 });
  const records = data?.content ?? [];

  const mapMarkers = records
    .filter(r => r.latitude && r.longitude)
    .map(r => ({ lat: r.latitude!, lng: r.longitude!, label: `${r.uniquePropertyIdentifier} — ${r.address}` }));

  return (
    <Layout title="RE Records" breadcrumbs={[{ label: 'Entities' }, { label: 'RE Records' }]}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#5d768b' }}>
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">RE Records</h2>
                <EntityTypeTag type="Static" />
              </div>
              <p className="text-sm text-gray-500">Entity 1 — {data?.totalElements ?? 0} records</p>
            </div>
          </div>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            <button onClick={() => setView('list')} className={`px-3 py-2 text-sm flex items-center gap-1.5 transition-colors ${view === 'list' ? 'text-white' : 'text-gray-600'}`} style={view === 'list' ? { backgroundColor: '#5d768b' } : {}}>
              <List className="w-4 h-4" /> List
            </button>
            <button onClick={() => setView('map')} className={`px-3 py-2 text-sm flex items-center gap-1.5 transition-colors ${view === 'map' ? 'text-white' : 'text-gray-600'}`} style={view === 'map' ? { backgroundColor: '#5d768b' } : {}}>
              <MapPin className="w-4 h-4" /> Map
            </button>
          </div>
        </div>

        {view === 'map' ? (
          <MapView latitude={17.4215} longitude={78.4085} address="Jubilee Hills, Hyderabad" markers={mapMarkers.length > 0 ? mapMarkers : undefined} height="500px" />
        ) : (
          <div className="liquid-glass rounded-2xl overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-gray-400">Loading RE Records...</div>
            ) : records.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No RE Records found</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">UPI</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Property Type</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Address</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Area</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Owner</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {records.map((r, i) => (
                        <motion.tr key={r.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-mono font-medium text-gray-900">{r.uniquePropertyIdentifier}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.propertyType}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 max-w-48 truncate" title={r.address}>{r.address}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{r.areaSize ? `${r.areaSize} ${r.areaUnit ?? 'sqft'}` : '—'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{r.currentOwnerName ?? '—'}</td>
                          <td className="px-4 py-3"><EntityStatusBadge status={r.approvalStatus ?? 'DRAFT'} size="sm" /></td>
                          <td className="px-4 py-3 text-xs text-gray-400">{r.mandal}, {r.district}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Page {page + 1} of {data?.totalPages ?? 1}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50">Previous</button>
                    <button onClick={() => setPage(p => p + 1)} disabled={page + 1 >= (data?.totalPages ?? 1)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50">Next</button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
