import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, AlertCircle, ChevronRight, Shield } from 'lucide-react';
import type { WorkflowStatusResponse } from '../../types';
import { USER_TYPE_DISPLAY_LABELS } from '../../types';

interface Props {
  workflow: WorkflowStatusResponse;
  canAct: boolean;
  onApprove: (remarks: string) => void;
  onReject: (remarks: string) => void;
  isLoading?: boolean;
}

export const ApprovalWorkflowPanel: React.FC<Props> = ({ workflow, canAct, onApprove, onReject, isLoading }) => {
  const [showRemarkDialog, setShowRemarkDialog] = useState<'approve' | 'reject' | null>(null);
  const [remarks, setRemarks] = useState('');

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'REJECTED': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'PENDING': return <Clock className="w-5 h-5 text-amber-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const currentPendingStep = workflow.steps.find(s => s.status === 'PENDING');

  const handleAction = (type: 'approve' | 'reject') => {
    if (type === 'approve') onApprove(remarks);
    else onReject(remarks);
    setShowRemarkDialog(null);
    setRemarks('');
  };

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#5d768b' }}>
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Approval Workflow</h3>
          <p className="text-sm text-gray-500">{workflow.currentStep} of {workflow.totalSteps} steps completed</p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(workflow.overallStatus)}`}>
          {workflow.overallStatus}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: '#5d768b' }}
          initial={{ width: 0 }}
          animate={{ width: `${workflow.totalSteps > 0 ? (workflow.currentStep / workflow.totalSteps) * 100 : 0}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {workflow.steps.map((step, index) => {
          const isCurrentPending = step.status === 'PENDING' && step.stepNumber === currentPendingStep?.stepNumber;
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-xl border p-4 transition-all ${
                isCurrentPending
                  ? 'border-amber-300 bg-amber-50 shadow-md'
                  : step.status === 'APPROVED'
                  ? 'border-green-200 bg-green-50'
                  : step.status === 'REJECTED'
                  ? 'border-red-200 bg-red-50'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{getStepIcon(step.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-gray-500">Step {step.stepNumber}</span>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900">
                      {USER_TYPE_DISPLAY_LABELS[step.requiredRole] ?? step.requiredRole}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(step.status)}`}>
                      {step.status}
                    </span>
                  </div>
                  {step.approverName && (
                    <p className="text-xs text-gray-600 mt-1">Signed by: <span className="font-medium">{step.approverName}</span></p>
                  )}
                  {step.digitalSignature && (
                    <p className="text-xs text-gray-400 mt-0.5 font-mono truncate">
                      Sig: {step.digitalSignature.substring(0, 32)}...
                    </p>
                  )}
                  {step.signedAt && (
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(step.signedAt).toLocaleString()}</p>
                  )}
                  {step.remarks && (
                    <p className="text-xs text-gray-600 mt-1 italic">"{step.remarks}"</p>
                  )}
                </div>
              </div>

              {/* Approve/Reject buttons for current pending step */}
              {canAct && isCurrentPending && !showRemarkDialog && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 mt-3 pt-3 border-t border-amber-200"
                >
                  <button
                    onClick={() => setShowRemarkDialog('approve')}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve & Sign
                  </button>
                  <button
                    onClick={() => setShowRemarkDialog('reject')}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </motion.div>
              )}

              {/* Remarks dialog inline */}
              {canAct && isCurrentPending && showRemarkDialog && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 pt-3 border-t border-amber-200"
                >
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add remarks (optional)..."
                    className="w-full p-2 rounded-lg border border-gray-300 text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleAction(showRemarkDialog)}
                      disabled={isLoading}
                      className={`flex-1 py-2 px-3 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 ${
                        showRemarkDialog === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {isLoading ? 'Processing...' : (showRemarkDialog === 'approve' ? 'Confirm Approval' : 'Confirm Rejection')}
                    </button>
                    <button
                      onClick={() => { setShowRemarkDialog(null); setRemarks(''); }}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {workflow.steps.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No workflow steps found</p>
        </div>
      )}
    </div>
  );
};
