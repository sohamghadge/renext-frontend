import apiClient from './client';
import type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  PaginatedResponse,
  UserType,
} from '@/types';
import { UserStatus } from '@/types';

export interface GetUsersParams {
  userType?: UserType;
  page?: number;
  size?: number;
  search?: string;
  status?: string;
}

// Backend UserDto has isActive:boolean instead of status:UserStatus
function mapUserDto(dto: Record<string, unknown>): User {
  return {
    id: String(dto.id),
    name: String(dto.name ?? ''),
    username: String(dto.username ?? ''),
    email: String(dto.email ?? ''),
    contactNumber: String(dto.contactNumber ?? ''),
    address: String(dto.address ?? ''),
    userType: dto.userType as User['userType'],
    primaryClassification: dto.primaryClassification as User['primaryClassification'],
    secondaryClassification: dto.secondaryClassification as User['secondaryClassification'],
    status: dto.isActive === false ? UserStatus.INACTIVE : UserStatus.ACTIVE,
    createdAt: String(dto.createdAt ?? ''),
    updatedAt: String(dto.updatedAt ?? ''),
  };
}

export const usersApi = {
  getUsers: async (params: GetUsersParams = {}): Promise<PaginatedResponse<User>> => {
    // After ApiResponse unwrapping, data is PagedResponse<UserDto>
    const { data } = await apiClient.get<Record<string, unknown>>('/users', {
      params: {
        userType: params.userType,
        page: params.page ?? 0,
        size: params.size ?? 20,
        search: params.search || undefined,
        status: params.status || undefined,
      },
    });
    const content = (data.content as Record<string, unknown>[]) ?? [];
    return {
      content: content.map(mapUserDto),
      totalElements: Number(data.totalElements ?? 0),
      totalPages: Number(data.totalPages ?? 0),
      size: Number(data.size ?? 20),
      number: Number(data.page ?? 0),
      first: Boolean(data.first),
      last: Boolean(data.last),
    };
  },

  getUserById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get<Record<string, unknown>>(`/users/${id}`);
    return mapUserDto(data);
  },

  createUser: async (payload: CreateUserPayload): Promise<User> => {
    const { data } = await apiClient.post<Record<string, unknown>>('/users', payload);
    return mapUserDto(data);
  },

  updateUser: async (id: string, payload: UpdateUserPayload): Promise<User> => {
    const { data } = await apiClient.put<Record<string, unknown>>(`/users/${id}`, payload);
    return mapUserDto(data);
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
