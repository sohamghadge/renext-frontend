import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Plus, List, MapPin, Eye } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { MapView } from '../../components/entities/MapView';
import { ApprovalWorkflowPanel } from '../../components/entities/ApprovalWorkflowPanel';
import { AuditTrail } from '../../components/entities/AuditTrail';
import { EntityStatusBadge } from '../../components/entities/EntityStatusBadge';
import { useDisputes, useCreateDispute, useDisputeWorkflow, useDisputeAuditTrail, useApproveDisputeStep, useRejectDisputeStep } from '../../hooks/useDisputes';
import { useReRecords } from '../../hooks/useReRecords';
import { useAuthStore } from '../../store/authStore';
import type { CreateDisputePayload } from '../../types';

type ViewMode = 'list' | 'map';

const EMPTY_FORM: CreateDisputePayload = {
  reRecordId: '',
  claimantName: '',
  claimantType: 'INDIVIDUAL',
  respondentName: '',
  respondentType: 'INDIVIDUAL',
  surveyorRemarks: '',
};

export default function DisputeResolution() {
  const { user } = useAuthStore();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateDisputePayload>(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const { data, isLoading } = useDisputes({ page: 0, size: 50 });
  const { data: reRecords } = useReRecords({ page: 0, size: 100 });
  const { data: workflow, isLoading: workflowLoading } = useDisputeWorkflow(selectedId ?? '');
  const { data: auditLogs } = useDisputeAuditTrail(selectedId ?? '');
  const createMutation = useCreateDispute();
  const approveMutation = useApproveDisputeStep();
  const rejectMutation = useRejectDisputeStep();

  const disputes = data?.content ?? [];
  const selected = disputes.find(d => d.id === selectedId);
  const canCreate = user?.userType === 'VRO';
  const canAct = workflow && user ? workflow.steps.some(s => s.status === 'PENDING' && (s.requiredRole === user.userType || s.requiredUserId === user.id)) : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.claimantName || !form.respondentName) {
      setFormError('Claimant and respondent names are required.');
      return;
    }
    try {
      await createMutation.mutateAsync({ ...form, reRecordId: form.reRecordId || undefined });
      setShowForm(false);
      setForm(EMPTY_FORM);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create dispute record.');
    }
  };

  const mapMarkers = disputes
    .filter(d => d.reRecordId)
    .map(d => {
      const re = reRecords?.content?.find(r => r.id === d.reRecordId);
      return re?.latitude && re?.longitude ? { lat: re.latitude, lng: re.longitude, label: `Dispute: ${d.claimantName} vs ${d.respondentName}` } : null;
    })
    .filter(Boolean) as { lat: number; lng: number; label: string }[];

  return (
    <Layout title="Dispute Resolution" breadcrumbs={[{ label: 'Functions' }, { label: 'Dispute Resolution' }]}>
      <div className="flex flex-col gap-6 h-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#5d768b' }}>
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Dispute Resolution</h2>
              <p className="text-sm text-gray-500">{disputes.length} dispute records</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-xl border border-gray-200 overflow-hidden">
              <button onClick={() => setViewMode('list')} className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'list' ? 'text-white' : 'text-gray-600 hover:bg-gray-50'}`} style={viewMode === 'list' ? { backgroundColor: '#5d768b' } : {}}>
                <List className="w-4 h-4" /> List
              </button>
              <button onClick={() => setViewMode('map')} className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'map' ? 'text-white' : 'text-gray-600 hover:bg-gray-50'}`} style={viewMode === 'map' ? { backgroundColor: '#5d768b' } : {}}>
                <MapPin className="w-4 h-4" /> Map
              </button>
            </div>
            {canCreate && (
              <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm hover:opacity-90 transition-opacity" style={{ backgroundColor: '#5d768b' }}>
                <Plus className="w-4 h-4" /> File Dispute
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-6 flex-1 min-h-0">
          {/* Left Panel */}
          <div className="flex-1 min-w-0">
            {viewMode === 'map' ? (
              <MapView
                latitude={mapMarkers[0]?.lat ?? 17.4215}
                longitude={mapMarkers[0]?.lng ?? 78.4085}
                address="Jubilee Hills, Hyderabad"
                markers={mapMarkers.length > 0 ? mapMarkers : undefined}
                height="100%"
              />
            ) : (
              <div className="liquid-glass rounded-2xl overflow-hidden">
                {isLoading ? (
                  <div className="p-8 text-center text-gray-400">Loading disputes...</div>
                ) : disputes.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No dispute records found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Claimant</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Respondent</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {disputes.map((dispute, idx) => (
                          <motion.tr key={dispute.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                            className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedId === dispute.id ? 'bg-blue-50' : ''}`}
                            onClick={() => setSelectedId(dispute.id)}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{dispute.claimantName ?? '—'}<span className="ml-1 text-xs text-gray-400">({dispute.claimantType})</span></td>
                            <td className="px-4 py-3 text-sm text-gray-600">{dispute.respondentName ?? '—'}</td>
                            <td className="px-4 py-3"><EntityStatusBadge status={dispute.approvalStatus} /></td>
                            <td className="px-4 py-3 text-sm text-gray-400">{new Date(dispute.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => setSelectedId(dispute.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Detail */}
          {selectedId && selected && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-96 flex flex-col gap-4 overflow-y-auto">
              <div className="liquid-glass rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-gray-500" />
                  <h3 className="font-semibold text-gray-900">Dispute Details</h3>
                  <button onClick={() => setSelectedId(null)} className="ml-auto text-gray-400 hover:text-gray-600 text-xs">Close</button>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Claimant</span><span className="font-medium">{selected.claimantName} ({selected.claimantType})</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Respondent</span><span className="font-medium">{selected.respondentName} ({selected.respondentType})</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Status</span><EntityStatusBadge status={selected.approvalStatus} size="sm" /></div>
                  {selected.surveyorRemarks && <div><span className="text-gray-500 block mb-1">Surveyor Remarks</span><p className="text-gray-700 bg-gray-50 rounded p-2">{selected.surveyorRemarks}</p></div>}
                  <div className="flex justify-between"><span className="text-gray-500">Filed</span><span>{new Date(selected.createdAt).toLocaleDateString()}</span></div>
                </div>
              </div>

              {workflow && !workflowLoading && (
                <ApprovalWorkflowPanel workflow={workflow} canAct={!!canAct}
                  onApprove={(remarks) => approveMutation.mutate({ id: selectedId, payload: { remarks } })}
                  onReject={(remarks) => rejectMutation.mutate({ id: selectedId, payload: { remarks } })}
                  isLoading={approveMutation.isPending || rejectMutation.isPending} />
              )}

              {auditLogs && auditLogs.length > 0 && <AuditTrail logs={auditLogs} />}
            </motion.div>
          )}
        </div>
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#5d768b' }}>
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">File Dispute Record</h3>
              <button onClick={() => setShowForm(false)} className="ml-auto text-gray-400 hover:text-gray-600 text-sm">Cancel</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">RE Record (Optional)</label>
                <select className="form-input" value={form.reRecordId} onChange={e => setForm(f => ({ ...f, reRecordId: e.target.value }))}>
                  <option value="">Select RE Record</option>
                  {reRecords?.content?.map(r => <option key={r.id} value={r.id}>{r.uniquePropertyIdentifier} — {r.address}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Claimant Name *</label>
                  <input className="form-input" required value={form.claimantName} onChange={e => setForm(f => ({ ...f, claimantName: e.target.value }))} placeholder="Claimant name" />
                </div>
                <div>
                  <label className="form-label">Claimant Type *</label>
                  <select className="form-input" value={form.claimantType} onChange={e => setForm(f => ({ ...f, claimantType: e.target.value }))}>
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="CORPORATE">Corporate</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Respondent Name *</label>
                  <input className="form-input" required value={form.respondentName} onChange={e => setForm(f => ({ ...f, respondentName: e.target.value }))} placeholder="Respondent name" />
                </div>
                <div>
                  <label className="form-label">Respondent Type *</label>
                  <select className="form-input" value={form.respondentType} onChange={e => setForm(f => ({ ...f, respondentType: e.target.value }))}>
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="CORPORATE">Corporate</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Surveyor Remarks</label>
                <textarea className="form-input" rows={3} value={form.surveyorRemarks} onChange={e => setForm(f => ({ ...f, surveyorRemarks: e.target.value }))} placeholder="Survey observations and remarks..." />
              </div>
              {formError && <p className="text-red-600 text-sm bg-red-50 rounded-lg p-3">{formError}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={createMutation.isPending} className="flex-1 py-3 rounded-xl text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50" style={{ backgroundColor: '#5d768b' }}>
                  {createMutation.isPending ? 'Filing...' : 'File Dispute'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </Layout>
  );
}
