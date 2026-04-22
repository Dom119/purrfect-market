const API_BASE = '/api'

async function fetchApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    const msg = (err as { message?: string }).message || 'Request failed'
    throw new Error(msg)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export interface AuthResponse {
  id: number
  email: string
  name: string
  /** "MAIN_ADMIN" | "USER" */
  userGroup?: string
}

export interface EmulationStatus {
  active: boolean
  originalAdmin: AuthResponse | null
}

export function isMainAdmin(user: AuthResponse | null | undefined): boolean {
  return user?.userGroup === 'MAIN_ADMIN'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface UpdateProfileRequest {
  name: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export const authApi = {
  login: (data: LoginRequest) =>
    fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: RegisterRequest) =>
    fetchApi<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    fetchApi<void>('/auth/logout', { method: 'POST' }),

  me: () => fetchApi<AuthResponse>('/auth/me'),

  updateProfile: (data: UpdateProfileRequest) =>
    fetchApi<AuthResponse>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  changePassword: (data: ChangePasswordRequest) =>
    fetchApi<AuthResponse>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getEmulation: () => fetchApi<EmulationStatus>('/auth/emulation'),

  stopEmulation: () =>
    fetchApi<AuthResponse>('/auth/emulate/stop', { method: 'POST' }),
}
