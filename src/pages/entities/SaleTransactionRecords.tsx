import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { EntityTypeTag } from '../../components/entities/EntityTypeTag';
import { EntityStatusBadge } from '../../components/entities/EntityStatusBadge';
import { useSaleTransactions } from '../../hooks/useSaleTransactions';

export default function SaleTransactionRecords() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useSaleTransactions({ page, size: 20 });
  const records = data?.content ?? [];

  return (
    <Layout title="Sale Transaction Records" breadcrumbs={[{ label: 'Entities' }, { label: 'Sale Transactions' }]}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#5d768b' }}>
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Sale Transaction Records</h2>
              <EntityTypeTag type="Dynamic" />
            </div>
            <p className="text-sm text-gray-500">Entity 3 — {data?.totalElements ?? 0} records</p>
          </div>
        </div>

        <div className="liquid-glass rounded-2xl overflow-hidden">
          {isLoading ? <div className="p-8 text-center text-gray-400">Loading...</div> :
           records.length === 0 ? <div className="p-8 text-center text-gray-400">No sale transactions found</div> : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Seller</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Seller Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Buyer</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Agent</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Sale Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Brokerage</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {records.map((r, i) => (
                      <motion.tr key={r.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.sellerName ?? '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.sellerType ?? '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.buyerName ?? '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.agentName ?? '—'}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.saleAmount ? `₹${r.saleAmount.toLocaleString('en-IN')}` : '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.brokerageAmount ? `₹${r.brokerageAmount.toLocaleString('en-IN')}` : '—'}</td>
                        <td className="px-4 py-3"><EntityStatusBadge status={r.approvalStatus} size="sm" /></td>
                        <td className="px-4 py-3 text-sm text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</td>
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
