import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rentalTransactionsApi } from '../api/rentalTransactions';
import type { CreateRentalTransactionPayload, ApproveWorkflowStepPayload } from '../types';
import { toast } from '../store/toastStore';

const KEYS = {
  all: ['rental-transactions'] as const,
  lists: () => [...KEYS.all, 'list'] as const,
  list: (params: object) => [...KEYS.lists(), params] as const,
  detail: (id: string) => [...KEYS.all, 'detail', id] as const,
  workflow: (id: string) => [...KEYS.all, 'workflow', id] as const,
  audit: (id: string) => [...KEYS.all, 'audit', id] as const,
};

export function useRentalTransactions(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: KEYS.list(params ?? {}),
    queryFn: () => rentalTransactionsApi.list(params),
    staleTime: 30 * 1000,
  });
}

export function useRentalTransaction(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => rentalTransactionsApi.get(id),
    enabled: !!id,
  });
}

export function useRentalTransactionWorkflow(id: string) {
  return useQuery({
    queryKey: KEYS.workflow(id),
    queryFn: () => rentalTransactionsApi.getWorkflow(id),
    enabled: !!id,
  });
}

export function useRentalTransactionAuditTrail(id: string) {
  return useQuery({
    queryKey: KEYS.audit(id),
    queryFn: () => rentalTransactionsApi.getAuditTrail(id),
    enabled: !!id,
  });
}

export function useCreateRentalTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRentalTransactionPayload) => rentalTransactionsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      toast.success('Rental transaction initiated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to initiate rental transaction');
    },
  });
}

export function useApproveRentalTransactionStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApproveWorkflowStepPayload }) =>
      rentalTransactionsApi.approveStep(id, payload),
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

export function useRejectRentalTransactionStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApproveWorkflowStepPayload }) =>
      rentalTransactionsApi.rejectStep(id, payload),
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
