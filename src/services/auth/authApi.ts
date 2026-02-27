export type AuthUser = {
  id: string;
  email: string;
  created_at?: string;
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    },
    credentials: 'include'
  });

  const data = (await res.json().catch(() => ({}))) as any;
  if (!res.ok) {
    throw new Error(data?.error || `Erro (${res.status})`);
  }
  return data as T;
}

export async function authLogin(email: string, password: string): Promise<AuthUser> {
  const data = await apiFetch<{ user: AuthUser }>('/api/auth/login.php', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  return data.user;
}

export async function authRegister(email: string, password: string): Promise<AuthUser> {
  const data = await apiFetch<{ user: AuthUser }>('/api/auth/register.php', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  return data.user;
}

export async function authLogout(): Promise<void> {
  await apiFetch<{ ok: boolean }>('/api/auth/logout.php', {
    method: 'POST',
    body: JSON.stringify({})
  });
}

export async function authMe(): Promise<AuthUser | null> {
  const data = await apiFetch<{ user: AuthUser | null }>('/api/auth/me.php', {
    method: 'GET'
  });
  return data.user;
}

export async function authRequestPasswordReset(email: string): Promise<void> {
  await apiFetch<{ ok: boolean }>('/api/auth/request_password_reset.php', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export async function authResetPassword(token: string, password: string): Promise<AuthUser> {
  const data = await apiFetch<{ user: AuthUser }>('/api/auth/reset_password.php', {
    method: 'POST',
    body: JSON.stringify({ token, password })
  });
  return data.user;
}
