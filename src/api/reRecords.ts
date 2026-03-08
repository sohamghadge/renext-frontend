import apiClient from './client';
import type {
  ReRecord,
  OwnershipRecord,
  WorkflowStatusResponse,
  EntityAuditLog,
  CreateReRecordPayload,
  ApproveWorkflowStepPayload,
} from '../types';

export interface GetReRecordsParams {
  district?: string;
  page?: number;
  size?: number;
}

export interface PagedReRecords {
  content: ReRecord[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const reRecordsApi = {
  list: async (params?: GetReRecordsParams): Promise<PagedReRecords> => {
    const { data } = await apiClient.get<Record<string, unknown>>('/re-records', { params });
    const content = (data?.content as ReRecord[]) ?? (Array.isArray(data) ? (data as ReRecord[]) : []);
    if (Array.isArray(data)) {
      return { content: data as ReRecord[], totalElements: data.length, totalPages: 1, size: data.length, number: 0 };
    }
    return {
      content,
      totalElements: Number(data?.totalElements ?? content.length),
      totalPages: Number(data?.totalPages ?? 1),
      size: Number(data?.size ?? 20),
      number: Number(data?.number ?? 0),
    };
  },

  get: async (id: string): Promise<ReRecord> => {
    const { data } = await apiClient.get<ReRecord>(`/re-records/${id}`);
    return data;
  },

  create: async (payload: CreateReRecordPayload): Promise<ReRecord> => {
    const { data } = await apiClient.post<ReRecord>('/re-records', payload);
    return data;
  },

  getOwnershipHistory: async (id: string): Promise<OwnershipRecord[]> => {
    const { data } = await apiClient.get<OwnershipRecord[]>(`/re-records/${id}/ownership-history`);
    return Array.isArray(data) ? data : [];
  },

  getWorkflow: async (id: string): Promise<WorkflowStatusResponse> => {
    const { data } = await apiClient.get<WorkflowStatusResponse>(`/re-records/${id}/workflow`);
    return data;
  },

  getAuditTrail: async (id: string): Promise<EntityAuditLog[]> => {
    const { data } = await apiClient.get<EntityAuditLog[]>(`/re-records/${id}/audit`);
    return Array.isArray(data) ? data : [];
  },

  approveStep: async (id: string, payload: ApproveWorkflowStepPayload): Promise<WorkflowStatusResponse> => {
    const { data } = await apiClient.post<WorkflowStatusResponse>(`/re-records/${id}/workflow/approve`, payload);
    return data;
  },

  rejectStep: async (id: string, payload: ApproveWorkflowStepPayload): Promise<WorkflowStatusResponse> => {
    const { data } = await apiClient.post<WorkflowStatusResponse>(`/re-records/${id}/workflow/reject`, payload);
    return data;
  },
};
