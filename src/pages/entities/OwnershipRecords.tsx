import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../../components/layout/Layout';
import { EntityTypeTag } from '../../components/entities/EntityTypeTag';
import { entityManagementApi } from '../../api/entityManagement';

export default function OwnershipRecords() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ['entities', 'ownership', page],
    queryFn: () => entityManagementApi.listOwnership({ page, size: 20 }),
  });
  const records = data?.content ?? [];

  return (
    <Layout title="Ownership Records" breadcrumbs={[{ label: 'Entities' }, { label: 'Ownership Records' }]}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#5d768b' }}>
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Ownership Records</h2>
              <EntityTypeTag type="Dynamic" />
            </div>
            <p className="text-sm text-gray-500">Entity 2 — {data?.totalElements ?? 0} records</p>
          </div>
        </div>

        <div className="liquid-glass rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : records.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No ownership records found</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Owner Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Owner Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">RE Record</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Issuance Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Current</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {records.map((r, i) => (
                      <motion.tr key={r.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.ownerName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.ownerType}</td>
                        <td className="px-4 py-3 text-xs font-mono text-gray-400">{r.reRecordId?.slice(0, 8)}...</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.ownershipIssuanceDate ? new Date(r.ownershipIssuanceDate).toLocaleDateString() : '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${r.ownerStatus === 'ACTIVE' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                            {r.ownerStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.isCurrent ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                            {r.isCurrent ? 'Current' : 'Historical'}
                          </span>
                        </td>
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
      </div>
    </Layout>
  );
}
