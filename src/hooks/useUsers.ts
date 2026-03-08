import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, type GetUsersParams } from '@/api/users';
import type { CreateUserPayload, UpdateUserPayload } from '@/types';
import { toast } from '@/store/toastStore';

export const USER_QUERY_KEYS = {
  all: ['users'] as const,
  lists: () => [...USER_QUERY_KEYS.all, 'list'] as const,
  list: (params: GetUsersParams) => [...USER_QUERY_KEYS.lists(), params] as const,
  detail: (id: string) => [...USER_QUERY_KEYS.all, 'detail', id] as const,
};

export function useUsers(params: GetUsersParams = {}) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.list(params),
    queryFn: () => usersApi.getUsers(params),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(id),
    queryFn: () => usersApi.getUserById(id),
    enabled: Boolean(id),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersApi.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      toast.success('User created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create user');
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      usersApi.updateUser(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.setQueryData(USER_QUERY_KEYS.detail(data.id), data);
      toast.success('User updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user');
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      toast.success('User deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });
}
