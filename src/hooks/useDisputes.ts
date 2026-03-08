import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { disputesApi } from '../api/disputes';
import type { CreateDisputePayload, ApproveWorkflowStepPayload } from '../types';
import { toast } from '../store/toastStore';

const KEYS = {
  all: ['disputes'] as const,
  lists: () => [...KEYS.all, 'list'] as const,
  list: (params: object) => [...KEYS.lists(), params] as const,
  detail: (id: string) => [...KEYS.all, 'detail', id] as const,
  workflow: (id: string) => [...KEYS.all, 'workflow', id] as const,
  audit: (id: string) => [...KEYS.all, 'audit', id] as const,
};

export function useDisputes(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: KEYS.list(params ?? {}),
    queryFn: () => disputesApi.list(params),
    staleTime: 30 * 1000,
  });
}

export function useDispute(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => disputesApi.get(id),
    enabled: !!id,
  });
}

export function useDisputeWorkflow(id: string) {
  return useQuery({
    queryKey: KEYS.workflow(id),
    queryFn: () => disputesApi.getWorkflow(id),
    enabled: !!id,
  });
}

export function useDisputeAuditTrail(id: string) {
  return useQuery({
    queryKey: KEYS.audit(id),
    queryFn: () => disputesApi.getAuditTrail(id),
    enabled: !!id,
  });
}

export function useCreateDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDisputePayload) => disputesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      toast.success('Dispute filed successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to file dispute');
    },
  });
}

export function useApproveDisputeStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApproveWorkflowStepPayload }) =>
      disputesApi.approveStep(id, payload),
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

export function useRejectDisputeStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApproveWorkflowStepPayload }) =>
      disputesApi.rejectStep(id, payload),
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
