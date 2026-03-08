import apiClient from './client';

export interface SalePricingDto {
  id: string;
  reRecordId?: string;
  amount: number;
  recordedAt: string;
  createdAt: string;
}

export interface RentalPricingDto {
  id: string;
  reRecordId?: string;
  amount: number;
  periodUnit?: string;
  recordedAt: string;
  createdAt: string;
}

export interface BrokeragePricingDto {
  id: string;
  reRecordId?: string;
  amount: number;
  recordedAt: string;
  createdAt: string;
}

export interface OwnershipDto {
  id: string;
  reRecordId: string;
  ownerUserId?: string;
  ownerName: string;
  ownerType: string;
  ownershipIssuanceDate?: string;
  ownerStatus: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PagedResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

function toPagedResult<T>(data: Record<string, unknown>): PagedResult<T> {
  const content = Array.isArray(data?.content) ? (data.content as T[]) : [];
  return {
    content,
    totalElements: Number(data?.totalElements ?? content.length),
    totalPages: Number(data?.totalPages ?? 1),
    size: Number(data?.size ?? 20),
    number: Number(data?.number ?? 0),
  };
}

export const entityManagementApi = {
  listSalePricing: async (params?: { page?: number; size?: number }): Promise<PagedResult<SalePricingDto>> => {
    const { data } = await apiClient.get<Record<string, unknown>>('/entities/sale-pricing', { params });
    return toPagedResult<SalePricingDto>(data);
  },

  listRentalPricing: async (params?: { page?: number; size?: number }): Promise<PagedResult<RentalPricingDto>> => {
    const { data } = await apiClient.get<Record<string, unknown>>('/entities/rental-pricing', { params });
    return toPagedResult<RentalPricingDto>(data);
  },

  listBrokeragePricing: async (params?: { page?: number; size?: number }): Promise<PagedResult<BrokeragePricingDto>> => {
    const { data } = await apiClient.get<Record<string, unknown>>('/entities/brokerage-pricing', { params });
    return toPagedResult<BrokeragePricingDto>(data);
  },

  listOwnership: async (params?: { page?: number; size?: number }): Promise<PagedResult<OwnershipDto>> => {
    const { data } = await apiClient.get<Record<string, unknown>>('/entities/ownership', { params });
    return toPagedResult<OwnershipDto>(data);
  },
};
