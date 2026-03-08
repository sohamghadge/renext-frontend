import apiClient from './client';
import type {
  SaleTransactionRecord,
  WorkflowStatusResponse,
  EntityAuditLog,
  CreateSaleTransactionPayload,
  ApproveWorkflowStepPayload,
} from '../types';

export interface PagedSaleTransactions {
  content: SaleTransactionRecord[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const saleTransactionsApi = {
  list: async (params?: { page?: number; size?: number }): Promise<PagedSaleTransactions> => {
    const { data } = await apiClient.get<Record<string, unknown>>('/sale-transactions', { params });
    if (Array.isArray(data)) {
      return { content: data as SaleTransactionRecord[], totalElements: data.length, totalPages: 1, size: data.length, number: 0 };
    }
    const content = (data?.content as SaleTransactionRecord[]) ?? [];
    return {
      content,
      totalElements: Number(data?.totalElements ?? content.length),
      totalPages: Number(data?.totalPages ?? 1),
      size: Number(data?.size ?? 20),
      number: Number(data?.number ?? 0),
    };
  },

  get: async (id: string): Promise<SaleTransactionRecord> => {
    const { data } = await apiClient.get<SaleTransactionRecord>(`/sale-transactions/${id}`);
    return data;
  },

  create: async (payload: CreateSaleTransactionPayload): Promise<SaleTransactionRecord> => {
    const { data } = await apiClient.post<SaleTransactionRecord>('/sale-transactions', payload);
    return data;
  },

  getWorkflow: async (id: string): Promise<WorkflowStatusResponse> => {
    const { data } = await apiClient.get<WorkflowStatusResponse>(`/sale-transactions/${id}/workflow`);
    return data;
  },

  getAuditTrail: async (id: string): Promise<EntityAuditLog[]> => {
    const { data } = await apiClient.get<EntityAuditLog[]>(`/sale-transactions/${id}/audit`);
    return Array.isArray(data) ? data : [];
  },

  approveStep: async (id: string, payload: ApproveWorkflowStepPayload): Promise<WorkflowStatusResponse> => {
    const { data } = await apiClient.post<WorkflowStatusResponse>(`/sale-transactions/${id}/workflow/approve`, payload);
    return data;
  },

  rejectStep: async (id: string, payload: ApproveWorkflowStepPayload): Promise<WorkflowStatusResponse> => {
    const { data } = await apiClient.post<WorkflowStatusResponse>(`/sale-transactions/${id}/workflow/reject`, payload);
    return data;
  },
};
