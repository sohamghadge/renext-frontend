import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reRecordsApi, type GetReRecordsParams } from '../api/reRecords';
import type { CreateReRecordPayload, ApproveWorkflowStepPayload } from '../types';
import { toast } from '../store/toastStore';

const KEYS = {
  all: ['re-records'] as const,
  lists: () => [...KEYS.all, 'list'] as const,
  list: (params: object) => [...KEYS.lists(), params] as const,
  detail: (id: string) => [...KEYS.all, 'detail', id] as const,
  workflow: (id: string) => [...KEYS.all, 'workflow', id] as const,
  audit: (id: string) => [...KEYS.all, 'audit', id] as const,
  ownership: (id: string) => [...KEYS.all, 'ownership', id] as const,
};

export function useReRecords(params?: GetReRecordsParams) {
  return useQuery({
    queryKey: KEYS.list(params ?? {}),
    queryFn: () => reRecordsApi.list(params),
    staleTime: 30 * 1000,
  });
}

export function useReRecord(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => reRecordsApi.get(id),
    enabled: !!id,
  });
}

export function useReRecordWorkflow(id: string) {
  return useQuery({
    queryKey: KEYS.workflow(id),
    queryFn: () => reRecordsApi.getWorkflow(id),
    enabled: !!id,
  });
}

export function useReRecordAuditTrail(id: string) {
  return useQuery({
    queryKey: KEYS.audit(id),
    queryFn: () => reRecordsApi.getAuditTrail(id),
    enabled: !!id,
  });
}

export function useOwnershipHistory(id: string) {
  return useQuery({
    queryKey: KEYS.ownership(id),
    queryFn: () => reRecordsApi.getOwnershipHistory(id),
    enabled: !!id,
  });
}

export function useCreateReRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReRecordPayload) => reRecordsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      toast.success('Property registered successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to register property');
    },
  });
}

export function useApproveReRecordStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApproveWorkflowStepPayload }) =>
      reRecordsApi.approveStep(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: KEYS.workflow(id) });
      queryClient.invalidateQueries({ queryKey: KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: KEYS.audit(id) });
      toast.success('Step approved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to approve step');
    },
  });
}

export function useRejectReRecordStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApproveWorkflowStepPayload }) =>
      reRecordsApi.rejectStep(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: KEYS.workflow(id) });
      queryClient.invalidateQueries({ queryKey: KEYS.detail(id) });
      toast.success('Step rejected');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reject step');
    },
  });
}
