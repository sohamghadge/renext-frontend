import apiClient from './client';
import type { AuthResponse, User, LoginPayload } from '@/types';
import { UserStatus } from '@/types';

// Maps a UserDto (from backend) to the frontend User shape.
// Backend has isActive:boolean instead of status:UserStatus.
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

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    // After ApiResponse unwrapping, data is LoginResponse:
    // { accessToken, tokenType, expiresIn, userId, username, name, email, userType, ... }
    const { data } = await apiClient.post<Record<string, unknown>>('/auth/login', payload);
    return {
      token: String(data.accessToken),
      user: {
        id: String(data.userId),
        name: String(data.name ?? ''),
        username: String(data.username ?? ''),
        email: String(data.email ?? ''),
        contactNumber: '',
        address: '',
        userType: data.userType as User['userType'],
        primaryClassification: data.primaryClassification as User['primaryClassification'],
        secondaryClassification: data.secondaryClassification as User['secondaryClassification'],
        status: UserStatus.ACTIVE,
        createdAt: '',
        updatedAt: '',
      },
    };
  },

  getCurrentUser: async (): Promise<User> => {
    // After ApiResponse unwrapping, data is UserDto
    const { data } = await apiClient.get<Record<string, unknown>>('/auth/me');
    return mapUserDto(data);
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore logout errors — we clear state regardless
    }
  },
};
