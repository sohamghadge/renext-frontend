import apiClient from './client';
import type {
  ProjectRecord,
  WorkflowStatusResponse,
  EntityAuditLog,
  CreateProjectRecordPayload,
  ApproveWorkflowStepPayload,
} from '../types';

export interface PagedProjectRecords {
  content: ProjectRecord[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const projectRecordsApi = {
  list: async (params?: { page?: number; size?: number }): Promise<PagedProjectRecords> => {
    const { data } = await apiClient.get<Record<string, unknown>>('/project-records', { params });
    if (Array.isArray(data)) {
      return { content: data as ProjectRecord[], totalElements: data.length, totalPages: 1, size: data.length, number: 0 };
    }
    const content = (data?.content as ProjectRecord[]) ?? [];
    return {
      content,
      totalElements: Number(data?.totalElements ?? content.length),
      totalPages: Number(data?.totalPages ?? 1),
      size: Number(data?.size ?? 20),
      number: Number(data?.number ?? 0),
    };
  },

  get: async (id: string): Promise<ProjectRecord> => {
    const { data } = await apiClient.get<ProjectRecord>(`/project-records/${id}`);
    return data;
  },

  create: async (payload: CreateProjectRecordPayload): Promise<ProjectRecord> => {
    const { data } = await apiClient.post<ProjectRecord>('/project-records', payload);
    return data;
  },

  getWorkflow: async (id: string): Promise<WorkflowStatusResponse> => {
    const { data } = await apiClient.get<WorkflowStatusResponse>(`/project-records/${id}/workflow`);
    return data;
  },

  getAuditTrail: async (id: string): Promise<EntityAuditLog[]> => {
    const { data } = await apiClient.get<EntityAuditLog[]>(`/project-records/${id}/audit`);
    return Array.isArray(data) ? data : [];
  },

  approveStep: async (id: string, payload: ApproveWorkflowStepPayload): Promise<WorkflowStatusResponse> => {
    const { data } = await apiClient.post<WorkflowStatusResponse>(`/project-records/${id}/workflow/approve`, payload);
    return data;
  },

  rejectStep: async (id: string, payload: ApproveWorkflowStepPayload): Promise<WorkflowStatusResponse> => {
    const { data } = await apiClient.post<WorkflowStatusResponse>(`/project-records/${id}/workflow/reject`, payload);
    return data;
  },
};
