import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Plus, Eye, X, RefreshCw, AlertCircle, ArrowLeft, DollarSign } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { ApprovalWorkflowPanel } from '../../components/entities/ApprovalWorkflowPanel';
import { AuditTrail } from '../../components/entities/AuditTrail';
import { EntityStatusBadge } from '../../components/entities/EntityStatusBadge';
import {
  useSaleTransactions,
  useCreateSaleTransaction,
  useSaleTransactionWorkflow,
  useSaleTransactionAuditTrail,
  useApproveSaleTransactionStep,
  useRejectSaleTransactionStep,
} from '../../hooks/useSaleTransactions';
import { useReRecords } from '../../hooks/useReRecords';
import { useAuth } from '../../hooks/useAuth';
import type { SaleTransactionRecord, CreateSaleTransactionPayload } from '../../types';
import { PartyType } from '../../types';

const PARTY_TYPES = Object.values(PartyType);

const EMPTY_FORM: CreateSaleTransactionPayload = {
  reRecordId: '',
  sellerName: '',
  sellerType: PartyType.INDIVIDUAL,
  buyerName: '',
  agentName: '',
  agentType: PartyType.INDIVIDUAL,
  saleAmount: 0,
  brokerageAmount: 0,
  escrowReferences: '',
  moneyFlowAuditTrail: '',
};

const DetailPanel: React.FC<{ record: SaleTransactionRecord; onClose: () => void; userType: string }> = ({ record, onClose, userType }) => {
  const { data: workflow, isLoading: wfLoading } = useSaleTransactionWorkflow(record.id);
  const { data: auditLogs } = useSaleTransactionAuditTrail(record.id);
  const approveStep = useApproveSaleTransactionStep();
  const rejectStep = useRejectSaleTransactionStep();

  const currentPendingRole = workflow?.steps.find(s => s.status === 'PENDING')?.requiredRole;
  const canAct = !!currentPendingRole && currentPendingRole === userType;

  const fmt = (n?: number) => n != null ? `₹${n.toLocaleString()}` : '—';

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto"
    >
      <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="btn-icon w-8 h-8"><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Transaction #{record.id.substring(0, 8)}</h2>
            <p className="text-xs text-gray-500">Sale Transaction</p>
          </div>
        </div>
        <EntityStatusBadge status={record.approvalStatus} />
      </div>

      <div className="p-6 space-y-6">
        <div className="liquid-glass rounded-2xl p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4" style={{ color: '#5d768b' }} />
            Transaction Details
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Seller', value: record.sellerName ?? '—' },
              { label: 'Seller Type', value: record.sellerType ?? '—' },
              { label: 'Buyer', value: record.buyerName ?? '—' },
              { label: 'Agent', value: record.agentName ?? '—' },
              { label: 'Agent Type', value: record.agentType ?? '—' },
              { label: 'Sale Amount', value: fmt(record.saleAmount) },
              { label: 'Brokerage', value: fmt(record.brokerageAmount) },
              { label: 'Date', value: record.saleTimestamp ? new Date(record.saleTimestamp).toLocaleDateString() : '—' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className="text-sm text-gray-800 mt-0.5 font-medium">{value}</p>
              </div>
            ))}
          </div>
          {record.escrowReferences && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-1">Escrow References</p>
              <p className="text-sm text-gray-700">{record.escrowReferences}</p>
            </div>
          )}
        </div>

        {wfLoading ? (
          <div className="liquid-glass rounded-2xl p-6 text-center text-gray-400">
            <RefreshCw className="w-5 h-5 mx-auto animate-spin mb-2" />
            <p className="text-sm">Loading workflow...</p>
          </div>
        ) : workflow ? (
          <ApprovalWorkflowPanel
            workflow={workflow}
            canAct={canAct}
            onApprove={(remarks) => approveStep.mutate({ id: record.id, payload: { remarks } })}
            onReject={(remarks) => rejectStep.mutate({ id: record.id, payload: { remarks } })}
            isLoading={approveStep.isPending || rejectStep.isPending}
          />
        ) : null}

        {auditLogs && <AuditTrail logs={auditLogs} />}
      </div>
    </motion.div>
  );
};

const CreateForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [form, setForm] = useState<CreateSaleTransactionPayload>(EMPTY_FORM);
  const createMutation = useCreateSaleTransaction();
  const { data: reRecordsData } = useReRecords();
  const reRecords = reRecordsData?.content ?? [];

  const set = <K extends keyof CreateSaleTransactionPayload>(field: K, value: CreateSaleTransactionPayload[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.reRecordId || !form.sellerName || !form.buyerName) return;
    await createMutation.mutateAsync(form);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="liquid-glass-strong w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Initiate Sale Transaction</h2>
          <button onClick={onClose} className="btn-icon w-8 h-8"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="form-label">Property (RE Record) *</label>
            <select className="form-input" required value={form.reRecordId} onChange={(e) => set('reRecordId', e.target.value)}>
              <option value="">Select property...</option>
              {reRecords.map((r) => <option key={r.id} value={r.id}>{r.uniquePropertyIdentifier} — {r.address.substring(0, 40)}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Seller Name *</label>
              <input className="form-input" required value={form.sellerName} onChange={(e) => set('sellerName', e.target.value)} placeholder="Seller's full name" />
            </div>
            <div>
              <label className="form-label">Seller Type</label>
              <select className="form-input" value={form.sellerType} onChange={(e) => set('sellerType', e.target.value)}>
                {PARTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Buyer Name *</label>
            <input className="form-input" required value={form.buyerName} onChange={(e) => set('buyerName', e.target.value)} placeholder="Buyer's full name" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Agent Name *</label>
              <input className="form-input" required value={form.agentName} onChange={(e) => set('agentName', e.target.value)} placeholder="Agent's full name" />
            </div>
            <div>
              <label className="form-label">Agent Type</label>
              <select className="form-input" value={form.agentType} onChange={(e) => set('agentType', e.target.value)}>
                {PARTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Sale Amount (₹) *</label>
              <input type="number" min="0" className="form-input" required value={form.saleAmount || ''} onChange={(e) => set('saleAmount', parseFloat(e.target.value) || 0)} placeholder="e.g. 5000000" />
            </div>
            <div>
              <label className="form-label">Brokerage Amount (₹)</label>
              <input type="number" min="0" className="form-input" value={form.brokerageAmount || ''} onChange={(e) => set('brokerageAmount', parseFloat(e.target.value) || 0)} placeholder="e.g. 50000" />
            </div>
          </div>

          <div>
            <label className="form-label">Escrow References</label>
            <input className="form-input" value={form.escrowReferences ?? ''} onChange={(e) => set('escrowReferences', e.target.value)} placeholder="Escrow reference numbers" />
          </div>

          <div>
            <label className="form-label">Money Flow Audit Trail</label>
            <textarea className="form-input h-16 resize-none" value={form.moneyFlowAuditTrail ?? ''} onChange={(e) => set('moneyFlowAuditTrail', e.target.value)} placeholder="Document money flow details" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2.5">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="btn-primary flex-1 py-2.5">
              {createMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
              {createMutation.isPending ? 'Initiating...' : 'Initiate Sale'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export const SaleTransaction: React.FC = () => {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useSaleTransactions();
  const [selectedRecord, setSelectedRecord] = useState<SaleTransactionRecord | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const records = data?.content ?? [];
  const userType = user?.userType ?? '';
  const canCreate = userType === 'AGENT' || userType === 'RENEXT_ADMIN';

  const fmt = (n?: number) => n != null ? `₹${n.toLocaleString()}` : '—';

  return (
    <Layout title="Sale Transactions" breadcrumbs={[{ label: 'Functions' }, { label: 'Sale Transaction' }]}>
      <div className="p-6 space-y-4 max-w-full">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5d768b, #4a6070)' }}>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Sale Transactions</h2>
              <p className="text-sm text-gray-500">{data?.totalElements ?? 0} transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => refetch()} className="btn-icon w-9 h-9">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
            {canCreate && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowCreateForm(true)} className="btn-primary py-2.5 px-5">
                <Plus className="w-4 h-4" /> Initiate Sale
              </motion.button>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="liquid-glass overflow-hidden">
          {isLoading ? (
            <div className="text-center py-16 text-gray-400"><RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2" /><p className="text-sm">Loading transactions...</p></div>
          ) : isError ? (
            <div className="text-center py-16"><AlertCircle className="w-8 h-8 mx-auto text-red-400 mb-2" /><p className="text-gray-500 text-sm">Failed to load transactions</p><button onClick={() => refetch()} className="btn-secondary py-2 px-4 text-sm mt-3">Try again</button></div>
          ) : records.length === 0 ? (
            <div className="text-center py-20">
              <TrendingUp className="w-10 h-10 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No sale transactions yet</p>
              {canCreate && <button onClick={() => setShowCreateForm(true)} className="btn-primary py-2 px-5 text-sm mt-3"><Plus className="w-4 h-4" /> Initiate Sale</button>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table w-full min-w-[800px]">
                <thead>
                  <tr className="bg-renext-bg/30">
                    <th className="px-5 py-3">Transaction ID</th>
                    <th className="px-5 py-3">Seller</th>
                    <th className="px-5 py-3">Buyer</th>
                    <th className="px-5 py-3">Agent</th>
                    <th className="px-5 py-3">Sale Amount</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, idx) => (
                    <motion.tr key={record.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }} className="group">
                      <td className="px-5 py-4"><p className="text-sm font-mono text-gray-700">{record.id.substring(0, 12)}...</p></td>
                      <td className="px-5 py-4"><p className="text-sm text-gray-900 font-medium">{record.sellerName ?? '—'}</p><p className="text-xs text-gray-400">{record.sellerType}</p></td>
                      <td className="px-5 py-4"><p className="text-sm text-gray-900">{record.buyerName ?? '—'}</p></td>
                      <td className="px-5 py-4"><p className="text-sm text-gray-700">{record.agentName ?? '—'}</p></td>
                      <td className="px-5 py-4"><p className="text-sm font-semibold text-gray-900">{fmt(record.saleAmount)}</p><p className="text-xs text-gray-400">Brokerage: {fmt(record.brokerageAmount)}</p></td>
                      <td className="px-5 py-4"><EntityStatusBadge status={record.approvalStatus} size="sm" /></td>
                      <td className="px-5 py-4">
                        <button onClick={() => setSelectedRecord(record)} className="btn-icon w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"><Eye className="w-3.5 h-3.5" /></button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedRecord && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelectedRecord(null)} />
            <DetailPanel record={selectedRecord} onClose={() => setSelectedRecord(null)} userType={userType} />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateForm && <CreateForm onClose={() => setShowCreateForm(false)} />}
      </AnimatePresence>
    </Layout>
  );
};

export default SaleTransaction;
