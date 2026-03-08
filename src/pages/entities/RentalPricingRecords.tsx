import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../../components/layout/Layout';
import { EntityTypeTag } from '../../components/entities/EntityTypeTag';
import { entityManagementApi } from '../../api/entityManagement';

export default function RentalPricingRecords() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ['entities', 'rental-pricing', page],
    queryFn: () => entityManagementApi.listRentalPricing({ page, size: 20 }),
  });
  const records = data?.content ?? [];

  return (
    <Layout title="Rental Pricing Records" breadcrumbs={[{ label: 'Entities' }, { label: 'Rental Pricing' }]}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#5d768b' }}>
            <Tag className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Rental Pricing Records</h2>
              <EntityTypeTag type="Dynamic" />
            </div>
            <p className="text-sm text-gray-500">Entity 7 — {data?.totalElements ?? 0} records</p>
          </div>
        </div>

        <div className="liquid-glass rounded-2xl overflow-hidden">
          {isLoading ? <div className="p-8 text-center text-gray-400">Loading...</div> :
           records.length === 0 ? <div className="p-8 text-center text-gray-400">No rental pricing records found</div> : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rental Pricing Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Period Unit</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">RE Record</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {records.map((r, i) => (
                      <motion.tr key={r.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs font-mono text-gray-400">{r.id.slice(0, 8)}...</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{Number(r.amount).toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.periodUnit ?? 'MONTH'}</td>
                        <td className="px-4 py-3 text-xs font-mono text-gray-400">{r.reRecordId ? `${r.reRecordId.slice(0, 8)}...` : '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{new Date(r.recordedAt).toLocaleString()}</td>
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
