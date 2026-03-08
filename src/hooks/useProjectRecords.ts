import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectRecordsApi } from '../api/projectRecords';
import type { CreateProjectRecordPayload, ApproveWorkflowStepPayload } from '../types';
import { toast } from '../store/toastStore';

const KEYS = {
  all: ['project-records'] as const,
  lists: () => [...KEYS.all, 'list'] as const,
  list: (params: object) => [...KEYS.lists(), params] as const,
  detail: (id: string) => [...KEYS.all, 'detail', id] as const,
  workflow: (id: string) => [...KEYS.all, 'workflow', id] as const,
  audit: (id: string) => [...KEYS.all, 'audit', id] as const,
};

export function useProjectRecords(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: KEYS.list(params ?? {}),
    queryFn: () => projectRecordsApi.list(params),
    staleTime: 30 * 1000,
  });
}

export function useProjectRecord(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => projectRecordsApi.get(id),
    enabled: !!id,
  });
}

export function useProjectRecordWorkflow(id: string) {
  return useQuery({
    queryKey: KEYS.workflow(id),
    queryFn: () => projectRecordsApi.getWorkflow(id),
    enabled: !!id,
  });
}

export function useProjectRecordAuditTrail(id: string) {
  return useQuery({
    queryKey: KEYS.audit(id),
    queryFn: () => projectRecordsApi.getAuditTrail(id),
    enabled: !!id,
  });
}

export function useCreateProjectRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProjectRecordPayload) => projectRecordsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      toast.success('Project record created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create project record');
    },
  });
}

export function useApproveProjectRecordStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApproveWorkflowStepPayload }) =>
      projectRecordsApi.approveStep(id, payload),
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

export function useRejectProjectRecordStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApproveWorkflowStepPayload }) =>
      projectRecordsApi.rejectStep(id, payload),
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
