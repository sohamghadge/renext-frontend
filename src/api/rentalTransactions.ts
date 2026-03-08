import apiClient from './client';
import type {
  RentalTransactionRecord,
  WorkflowStatusResponse,
  EntityAuditLog,
  CreateRentalTransactionPayload,
  ApproveWorkflowStepPayload,
} from '../types';

export interface PagedRentalTransactions {
  content: RentalTransactionRecord[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const rentalTransactionsApi = {
  list: async (params?: { page?: number; size?: number }): Promise<PagedRentalTransactions> => {
    const { data } = await apiClient.get<Record<string, unknown>>('/rental-transactions', { params });
    if (Array.isArray(data)) {
      return { content: data as RentalTransactionRecord[], totalElements: data.length, totalPages: 1, size: data.length, number: 0 };
    }
    const content = (data?.content as RentalTransactionRecord[]) ?? [];
    return {
      content,
      totalElements: Number(data?.totalElements ?? content.length),
      totalPages: Number(data?.totalPages ?? 1),
      size: Number(data?.size ?? 20),
      number: Number(data?.number ?? 0),
    };
  },

  get: async (id: string): Promise<RentalTransactionRecord> => {
    const { data } = await apiClient.get<RentalTransactionRecord>(`/rental-transactions/${id}`);
    return data;
  },

  create: async (payload: CreateRentalTransactionPayload): Promise<RentalTransactionRecord> => {
    const { data } = await apiClient.post<RentalTransactionRecord>('/rental-transactions', payload);
    return data;
  },

  getWorkflow: async (id: string): Promise<WorkflowStatusResponse> => {
    const { data } = await apiClient.get<WorkflowStatusResponse>(`/rental-transactions/${id}/workflow`);
    return data;
  },

  getAuditTrail: async (id: string): Promise<EntityAuditLog[]> => {
    const { data } = await apiClient.get<EntityAuditLog[]>(`/rental-transactions/${id}/audit`);
    return Array.isArray(data) ? data : [];
  },

  approveStep: async (id: string, payload: ApproveWorkflowStepPayload): Promise<WorkflowStatusResponse> => {
    const { data } = await apiClient.post<WorkflowStatusResponse>(`/rental-transactions/${id}/workflow/approve`, payload);
    return data;
  },

  rejectStep: async (id: string, payload: ApproveWorkflowStepPayload): Promise<WorkflowStatusResponse> => {
    const { data } = await apiClient.post<WorkflowStatusResponse>(`/rental-transactions/${id}/workflow/reject`, payload);
    return data;
  },
};
