import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  List,
  Plus,
  Home,
  Eye,
  X,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  Building2,
  Layers,
} from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { MapView } from '../../components/entities/MapView';
import { ApprovalWorkflowPanel } from '../../components/entities/ApprovalWorkflowPanel';
import { AuditTrail } from '../../components/entities/AuditTrail';
import { EntityStatusBadge } from '../../components/entities/EntityStatusBadge';
import {
  useReRecords,
  useReRecordWorkflow,
  useReRecordAuditTrail,
  useOwnershipHistory,
  useCreateReRecord,
  useApproveReRecordStep,
  useRejectReRecordStep,
} from '../../hooks/useReRecords';
import { useAuth } from '../../hooks/useAuth';
import type { ReRecord, CreateReRecordPayload } from '../../types';
import { PropertyType, PartyType, OwnerStatus } from '../../types';

const PROPERTY_TYPES = Object.values(PropertyType);
const PARTY_TYPES = Object.values(PartyType);
const OWNER_STATUSES = Object.values(OwnerStatus);

const EMPTY_FORM: CreateReRecordPayload = {
  propertyType: PROPERTY_TYPES[0],
  uniquePropertyIdentifier: '',
  address: '',
  latitude: undefined,
  longitude: undefined,
  areaSize: undefined,
  areaUnit: 'sq ft',
  village: '',
  mandal: '',
  district: '',
  state: '',
  surveyorRemarks: '',
  ownerName: '',
  ownerType: PARTY_TYPES[0],
  ownershipIssuanceDate: '',
  ownerStatus: OWNER_STATUSES[0],
};

// ---- Detail Panel ----
const DetailPanel: React.FC<{
  record: ReRecord;
  onClose: () => void;
  userType: string;
}> = ({ record, onClose, userType }) => {
  const { data: workflow, isLoading: wfLoading } = useReRecordWorkflow(record.id);
  const { data: auditLogs, isLoading: auditLoading } = useReRecordAuditTrail(record.id);
  const { data: ownershipHistory } = useOwnershipHistory(record.id);
  const approveStep = useApproveReRecordStep();
  const rejectStep = useRejectReRecordStep();

  const currentPendingRole = workflow?.steps.find(s => s.status === 'PENDING')?.requiredRole;
  const canAct = !!currentPendingRole && currentPendingRole === userType;

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
          <button onClick={onClose} className="btn-icon w-8 h-8">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-semibold text-gray-900 truncate max-w-xs">{record.uniquePropertyIdentifier}</h2>
            <p className="text-xs text-gray-500">{record.propertyType}</p>
          </div>
        </div>
        {record.approvalStatus && <EntityStatusBadge status={record.approvalStatus} />}
      </div>

      <div className="p-6 space-y-6">
        {/* Map */}
        <MapView
          latitude={record.latitude}
          longitude={record.longitude}
          address={record.address}
          height="200px"
        />

        {/* Property Details */}
        <div className="liquid-glass rounded-2xl p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4" style={{ color: '#5d768b' }} />
            Property Details
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Address', value: record.address },
              { label: 'Area', value: record.areaSize ? `${record.areaSize} ${record.areaUnit ?? ''}` : '—' },
              { label: 'Village', value: record.village || '—' },
              { label: 'Mandal', value: record.mandal || '—' },
              { label: 'District', value: record.district || '—' },
              { label: 'State', value: record.state || '—' },
              { label: 'Current Owner', value: record.currentOwnerName || '—' },
              { label: 'Created', value: new Date(record.createdAt).toLocaleDateString() },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className="text-sm text-gray-800 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
          {record.surveyorRemarks && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-1">Surveyor Remarks</p>
              <p className="text-sm text-gray-700 italic">"{record.surveyorRemarks}"</p>
            </div>
          )}
        </div>

        {/* Ownership History */}
        {ownershipHistory && ownershipHistory.length > 0 && (
          <div className="liquid-glass rounded-2xl p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4" style={{ color: '#5d768b' }} />
              Ownership History
            </h3>
            <div className="space-y-2">
              {ownershipHistory.map((oh) => (
                <div key={oh.id} className={`flex items-center justify-between p-3 rounded-xl border ${oh.isCurrent ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{oh.ownerName}</p>
                    <p className="text-xs text-gray-500">{oh.ownerType} {oh.ownershipIssuanceDate ? `• Since ${new Date(oh.ownershipIssuanceDate).toLocaleDateString()}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <EntityStatusBadge status={oh.ownerStatus} size="sm" />
                    {oh.isCurrent && <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Current</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workflow */}
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

        {/* Audit Trail */}
        {auditLoading ? null : auditLogs ? (
          <AuditTrail logs={auditLogs} />
        ) : null}
      </div>
    </motion.div>
  );
};

// ---- Create Form Modal ----
const CreateForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [form, setForm] = useState<CreateReRecordPayload>(EMPTY_FORM);
  const createMutation = useCreateReRecord();

  const set = (field: keyof CreateReRecordPayload, value: string | number | undefined) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.uniquePropertyIdentifier.trim() || !form.address.trim() || !form.ownerName.trim()) {
      return;
    }
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
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="liquid-glass-strong w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Register New Property</h2>
          <button onClick={onClose} className="btn-icon w-8 h-8"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Property Type *</label>
              <select className="form-input" value={form.propertyType} onChange={(e) => set('propertyType', e.target.value)}>
                {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Unique Property ID *</label>
              <input className="form-input" required value={form.uniquePropertyIdentifier} onChange={(e) => set('uniquePropertyIdentifier', e.target.value)} placeholder="e.g. AP-2024-001234" />
            </div>
          </div>

          <div>
            <label className="form-label">Address *</label>
            <input className="form-input" required value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Full property address" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Latitude</label>
              <input type="number" step="any" className="form-input" value={form.latitude ?? ''} onChange={(e) => set('latitude', e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="e.g. 17.3850" />
            </div>
            <div>
              <label className="form-label">Longitude</label>
              <input type="number" step="any" className="form-input" value={form.longitude ?? ''} onChange={(e) => set('longitude', e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="e.g. 78.4867" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="form-label">Area Size</label>
              <input type="number" className="form-input" value={form.areaSize ?? ''} onChange={(e) => set('areaSize', e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="e.g. 1200" />
            </div>
            <div>
              <label className="form-label">Area Unit</label>
              <select className="form-input" value={form.areaUnit ?? 'sq ft'} onChange={(e) => set('areaUnit', e.target.value)}>
                {['sq ft', 'sq m', 'acres', 'hectares', 'cents'].map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Village</label>
              <input className="form-input" value={form.village ?? ''} onChange={(e) => set('village', e.target.value)} placeholder="Village name" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="form-label">Mandal</label>
              <input className="form-input" value={form.mandal ?? ''} onChange={(e) => set('mandal', e.target.value)} placeholder="Mandal name" />
            </div>
            <div>
              <label className="form-label">District</label>
              <input className="form-input" value={form.district ?? ''} onChange={(e) => set('district', e.target.value)} placeholder="District name" />
            </div>
            <div>
              <label className="form-label">State</label>
              <input className="form-input" value={form.state ?? ''} onChange={(e) => set('state', e.target.value)} placeholder="e.g. Andhra Pradesh" />
            </div>
          </div>

          <div>
            <label className="form-label">Surveyor Remarks</label>
            <textarea className="form-input h-16 resize-none" value={form.surveyorRemarks ?? ''} onChange={(e) => set('surveyorRemarks', e.target.value)} placeholder="Optional surveyor notes" />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Owner Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Owner Name *</label>
                <input className="form-input" required value={form.ownerName} onChange={(e) => set('ownerName', e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <label className="form-label">Owner Type</label>
                <select className="form-input" value={form.ownerType} onChange={(e) => set('ownerType', e.target.value)}>
                  {PARTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className="form-label">Issuance Date</label>
                <input type="date" className="form-input" value={form.ownershipIssuanceDate ?? ''} onChange={(e) => set('ownershipIssuanceDate', e.target.value)} />
              </div>
              <div>
                <label className="form-label">Owner Status</label>
                <select className="form-input" value={form.ownerStatus ?? OWNER_STATUSES[0]} onChange={(e) => set('ownerStatus', e.target.value)}>
                  {OWNER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2.5">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="btn-primary flex-1 py-2.5">
              {createMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {createMutation.isPending ? 'Registering...' : 'Register Property'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ---- Main Page ----
export const RERegistration: React.FC = () => {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useReRecords();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedRecord, setSelectedRecord] = useState<ReRecord | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const records = data?.content ?? [];
  const userType = user?.userType ?? '';
  const canCreate = userType === 'VRO' || userType === 'RENEXT_ADMIN';

  const allMarkers = records
    .filter((r) => r.latitude && r.longitude)
    .map((r) => ({ lat: r.latitude!, lng: r.longitude!, label: r.uniquePropertyIdentifier }));

  return (
    <Layout
      title="RE Registration"
      breadcrumbs={[{ label: 'Functions' }, { label: 'RE Registration' }]}
    >
      <div className="p-6 space-y-4 max-w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5d768b, #4a6070)' }}>
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">RE Registration</h2>
              <p className="text-sm text-gray-500">{data?.totalElements ?? 0} properties registered</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* View toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List className="w-3.5 h-3.5" /> List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'map' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <MapPin className="w-3.5 h-3.5" /> Map
              </button>
            </div>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => refetch()} className="btn-icon w-9 h-9">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>

            {canCreate && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowCreateForm(true)} className="btn-primary py-2.5 px-5">
                <Plus className="w-4 h-4" /> Register Property
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Map view */}
        <AnimatePresence mode="wait">
          {viewMode === 'map' && (
            <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {records.length > 0 ? (
                <MapView
                  latitude={allMarkers[0]?.lat}
                  longitude={allMarkers[0]?.lng}
                  address="All Properties"
                  markers={allMarkers}
                  height="500px"
                />
              ) : (
                <div className="liquid-glass rounded-2xl flex items-center justify-center" style={{ height: '400px' }}>
                  <div className="text-center text-gray-400">
                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No properties with GPS coordinates</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* List view */}
          {viewMode === 'list' && (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="liquid-glass overflow-hidden">
              {isLoading ? (
                <div className="text-center py-16 text-gray-400">
                  <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2" />
                  <p className="text-sm">Loading properties...</p>
                </div>
              ) : isError ? (
                <div className="text-center py-16">
                  <AlertCircle className="w-8 h-8 mx-auto text-red-400 mb-2" />
                  <p className="text-gray-500 text-sm">Failed to load properties</p>
                  <button onClick={() => refetch()} className="btn-secondary py-2 px-4 text-sm mt-3">Try again</button>
                </div>
              ) : records.length === 0 ? (
                <div className="text-center py-20">
                  <Home className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No properties registered yet</p>
                  {canCreate && (
                    <button onClick={() => setShowCreateForm(true)} className="btn-primary py-2 px-5 text-sm mt-3">
                      <Plus className="w-4 h-4" /> Register First Property
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="data-table w-full min-w-[700px]">
                    <thead>
                      <tr className="bg-renext-bg/30">
                        <th className="px-5 py-3">Property ID</th>
                        <th className="px-5 py-3">Type</th>
                        <th className="px-5 py-3">Address</th>
                        <th className="px-5 py-3">Owner</th>
                        <th className="px-5 py-3">Area</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record, idx) => (
                        <motion.tr
                          key={record.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="group"
                        >
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-gray-900">{record.uniquePropertyIdentifier}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-700">{record.propertyType}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-700 truncate max-w-[180px]">{record.address}</p>
                            {record.district && <p className="text-xs text-gray-400">{record.district}</p>}
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-700">{record.currentOwnerName ?? '—'}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-700">
                              {record.areaSize ? `${record.areaSize} ${record.areaUnit ?? ''}` : '—'}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            {record.approvalStatus ? <EntityStatusBadge status={record.approvalStatus} size="sm" /> : <span className="text-xs text-gray-400">—</span>}
                          </td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => setSelectedRecord(record)}
                              className="btn-icon w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selectedRecord && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setSelectedRecord(null)}
            />
            <DetailPanel
              record={selectedRecord}
              onClose={() => setSelectedRecord(null)}
              userType={userType}
            />
          </>
        )}
      </AnimatePresence>

      {/* Create form */}
      <AnimatePresence>
        {showCreateForm && <CreateForm onClose={() => setShowCreateForm(false)} />}
      </AnimatePresence>
    </Layout>
  );
};

export default RERegistration;
