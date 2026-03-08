import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Plus, Eye, X, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { ApprovalWorkflowPanel } from '../../components/entities/ApprovalWorkflowPanel';
import { AuditTrail } from '../../components/entities/AuditTrail';
import { EntityStatusBadge } from '../../components/entities/EntityStatusBadge';
import {
  useRentalTransactions,
  useCreateRentalTransaction,
  useRentalTransactionWorkflow,
  useRentalTransactionAuditTrail,
  useApproveRentalTransactionStep,
  useRejectRentalTransactionStep,
} from '../../hooks/useRentalTransactions';
import { useReRecords } from '../../hooks/useReRecords';
import { useAuth } from '../../hooks/useAuth';
import type { RentalTransactionRecord, CreateRentalTransactionPayload } from '../../types';
import { PartyType } from '../../types';

const PARTY_TYPES = Object.values(PartyType);
const PERIOD_UNITS = ['Monthly', 'Quarterly', 'Annual'];

const EMPTY_FORM: CreateRentalTransactionPayload = {
  reRecordId: '',
  leaserName: '',
  leaserType: PartyType.INDIVIDUAL,
  tenantName: '',
  agentName: '',
  agentType: PartyType.INDIVIDUAL,
  rentalAmount: 0,
  periodUnit: 'Monthly',
  brokerageAmount: 0,
};

const DetailPanel: React.FC<{ record: RentalTransactionRecord; onClose: () => void; userType: string }> = ({ record, onClose, userType }) => {
  const { data: workflow, isLoading: wfLoading } = useRentalTransactionWorkflow(record.id);
  const { data: auditLogs } = useRentalTransactionAuditTrail(record.id);
  const approveStep = useApproveRentalTransactionStep();
  const rejectStep = useRejectRentalTransactionStep();

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
            <h2 className="text-base font-semibold text-gray-900">Rental #{record.id.substring(0, 8)}</h2>
            <p className="text-xs text-gray-500">Rental Transaction</p>
          </div>
        </div>
        <EntityStatusBadge status={record.approvalStatus} />
      </div>

      <div className="p-6 space-y-6">
        <div className="liquid-glass rounded-2xl p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Key className="w-4 h-4" style={{ color: '#5d768b' }} />
            Rental Details
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Leaser', value: record.leaserName ?? '—' },
              { label: 'Leaser Type', value: record.leaserType ?? '—' },
              { label: 'Tenant', value: record.tenantName ?? '—' },
              { label: 'Agent', value: record.agentName ?? '—' },
              { label: 'Rental Amount', value: `${fmt(record.rentalAmount)} / ${record.periodUnit ?? 'period'}` },
              { label: 'Brokerage', value: fmt(record.brokerageAmount) },
              { label: 'Date', value: record.rentalTimestamp ? new Date(record.rentalTimestamp).toLocaleDateString() : '—' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className="text-sm text-gray-800 mt-0.5 font-medium">{value}</p>
              </div>
            ))}
          </div>
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
  const [form, setForm] = useState<CreateRentalTransactionPayload>(EMPTY_FORM);
  const createMutation = useCreateRentalTransaction();
  const { data: reRecordsData } = useReRecords();
  const reRecords = reRecordsData?.content ?? [];

  const set = <K extends keyof CreateRentalTransactionPayload>(field: K, value: CreateRentalTransactionPayload[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.reRecordId || !form.leaserName || !form.tenantName) return;
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
          <h2 className="text-lg font-bold text-gray-900">Initiate Rental Transaction</h2>
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
              <label className="form-label">Leaser Name *</label>
              <input className="form-input" required value={form.leaserName} onChange={(e) => set('leaserName', e.target.value)} placeholder="Property owner/leaser" />
            </div>
            <div>
              <label className="form-label">Leaser Type</label>
              <select className="form-input" value={form.leaserType} onChange={(e) => set('leaserType', e.target.value)}>
                {PARTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Tenant Name *</label>
            <input className="form-input" required value={form.tenantName} onChange={(e) => set('tenantName', e.target.value)} placeholder="Tenant's full name" />
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="form-label">Rental Amount (₹) *</label>
              <input type="number" min="0" className="form-input" required value={form.rentalAmount || ''} onChange={(e) => set('rentalAmount', parseFloat(e.target.value) || 0)} placeholder="e.g. 25000" />
            </div>
            <div>
              <label className="form-label">Period Unit</label>
              <select className="form-input" value={form.periodUnit} onChange={(e) => set('periodUnit', e.target.value)}>
                {PERIOD_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Brokerage (₹)</label>
              <input type="number" min="0" className="form-input" value={form.brokerageAmount || ''} onChange={(e) => set('brokerageAmount', parseFloat(e.target.value) || 0)} placeholder="e.g. 25000" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2.5">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="btn-primary flex-1 py-2.5">
              {createMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
              {createMutation.isPending ? 'Initiating...' : 'Initiate Rental'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export const RentalTransaction: React.FC = () => {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useRentalTransactions();
  const [selectedRecord, setSelectedRecord] = useState<RentalTransactionRecord | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const records = data?.content ?? [];
  const userType = user?.userType ?? '';
  const canCreate = userType === 'AGENT' || userType === 'RENEXT_ADMIN';
  const fmt = (n?: number) => n != null ? `₹${n.toLocaleString()}` : '—';

  return (
    <Layout title="Rental Transactions" breadcrumbs={[{ label: 'Functions' }, { label: 'Rental Transaction' }]}>
      <div className="p-6 space-y-4 max-w-full">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5d768b, #4a6070)' }}>
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Rental Transactions</h2>
              <p className="text-sm text-gray-500">{data?.totalElements ?? 0} transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => refetch()} className="btn-icon w-9 h-9">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
            {canCreate && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowCreateForm(true)} className="btn-primary py-2.5 px-5">
                <Plus className="w-4 h-4" /> Initiate Rental
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
              <Key className="w-10 h-10 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No rental transactions yet</p>
              {canCreate && <button onClick={() => setShowCreateForm(true)} className="btn-primary py-2 px-5 text-sm mt-3"><Plus className="w-4 h-4" /> Initiate Rental</button>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table w-full min-w-[800px]">
                <thead>
                  <tr className="bg-renext-bg/30">
                    <th className="px-5 py-3">Transaction ID</th>
                    <th className="px-5 py-3">Leaser</th>
                    <th className="px-5 py-3">Tenant</th>
                    <th className="px-5 py-3">Agent</th>
                    <th className="px-5 py-3">Rental Amount</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, idx) => (
                    <motion.tr key={record.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }} className="group">
                      <td className="px-5 py-4"><p className="text-sm font-mono text-gray-700">{record.id.substring(0, 12)}...</p></td>
                      <td className="px-5 py-4"><p className="text-sm font-medium text-gray-900">{record.leaserName ?? '—'}</p><p className="text-xs text-gray-400">{record.leaserType}</p></td>
                      <td className="px-5 py-4"><p className="text-sm text-gray-900">{record.tenantName ?? '—'}</p></td>
                      <td className="px-5 py-4"><p className="text-sm text-gray-700">{record.agentName ?? '—'}</p></td>
                      <td className="px-5 py-4"><p className="text-sm font-semibold text-gray-900">{fmt(record.rentalAmount)} / {record.periodUnit ?? '—'}</p></td>
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

export default RentalTransaction;
