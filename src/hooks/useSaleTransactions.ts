import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { saleTransactionsApi } from '../api/saleTransactions';
import type { CreateSaleTransactionPayload, ApproveWorkflowStepPayload } from '../types';
import { toast } from '../store/toastStore';

const KEYS = {
  all: ['sale-transactions'] as const,
  lists: () => [...KEYS.all, 'list'] as const,
  list: (params: object) => [...KEYS.lists(), params] as const,
  detail: (id: string) => [...KEYS.all, 'detail', id] as const,
  workflow: (id: string) => [...KEYS.all, 'workflow', id] as const,
  audit: (id: string) => [...KEYS.all, 'audit', id] as const,
};

export function useSaleTransactions(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: KEYS.list(params ?? {}),
    queryFn: () => saleTransactionsApi.list(params),
    staleTime: 30 * 1000,
  });
}

export function useSaleTransaction(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => saleTransactionsApi.get(id),
    enabled: !!id,
  });
}

export function useSaleTransactionWorkflow(id: string) {
  return useQuery({
    queryKey: KEYS.workflow(id),
    queryFn: () => saleTransactionsApi.getWorkflow(id),
    enabled: !!id,
  });
}

export function useSaleTransactionAuditTrail(id: string) {
  return useQuery({
    queryKey: KEYS.audit(id),
    queryFn: () => saleTransactionsApi.getAuditTrail(id),
    enabled: !!id,
  });
}

export function useCreateSaleTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSaleTransactionPayload) => saleTransactionsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      toast.success('Sale transaction initiated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to initiate sale transaction');
    },
  });
}

export function useApproveSaleTransactionStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApproveWorkflowStepPayload }) =>
      saleTransactionsApi.approveStep(id, payload),
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

export function useRejectSaleTransactionStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApproveWorkflowStepPayload }) =>
      saleTransactionsApi.rejectStep(id, payload),
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
