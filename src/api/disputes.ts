import apiClient from './client';
import type {
  DisputeRecord,
  WorkflowStatusResponse,
  EntityAuditLog,
  CreateDisputePayload,
  ApproveWorkflowStepPayload,
} from '../types';

export interface PagedDisputes {
  content: DisputeRecord[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const disputesApi = {
  list: async (params?: { page?: number; size?: number }): Promise<PagedDisputes> => {
    const { data } = await apiClient.get<Record<string, unknown>>('/disputes', { params });
    if (Array.isArray(data)) {
      return { content: data as DisputeRecord[], totalElements: data.length, totalPages: 1, size: data.length, number: 0 };
    }
    const content = (data?.content as DisputeRecord[]) ?? [];
    return {
      content,
      totalElements: Number(data?.totalElements ?? content.length),
      totalPages: Number(data?.totalPages ?? 1),
      size: Number(data?.size ?? 20),
      number: Number(data?.number ?? 0),
    };
  },

  get: async (id: string): Promise<DisputeRecord> => {
    const { data } = await apiClient.get<DisputeRecord>(`/disputes/${id}`);
    return data;
  },

  create: async (payload: CreateDisputePayload): Promise<DisputeRecord> => {
    const { data } = await apiClient.post<DisputeRecord>('/disputes', payload);
    return data;
  },

  getWorkflow: async (id: string): Promise<WorkflowStatusResponse> => {
    const { data } = await apiClient.get<WorkflowStatusResponse>(`/disputes/${id}/workflow`);
    return data;
  },

  getAuditTrail: async (id: string): Promise<EntityAuditLog[]> => {
    const { data } = await apiClient.get<EntityAuditLog[]>(`/disputes/${id}/audit`);
    return Array.isArray(data) ? data : [];
  },

  approveStep: async (id: string, payload: ApproveWorkflowStepPayload): Promise<WorkflowStatusResponse> => {
    const { data } = await apiClient.post<WorkflowStatusResponse>(`/disputes/${id}/workflow/approve`, payload);
    return data;
  },

  rejectStep: async (id: string, payload: ApproveWorkflowStepPayload): Promise<WorkflowStatusResponse> => {
    const { data } = await apiClient.post<WorkflowStatusResponse>(`/disputes/${id}/workflow/reject`, payload);
    return data;
  },
};
