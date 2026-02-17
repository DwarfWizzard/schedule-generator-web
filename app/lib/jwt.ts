export interface JwtPayload {
  exp: number;
  iat: number;
  user_id: string;
  user_role: number;
  // добавь сюда свои кастомные поля, если есть
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;

    const decoded = JSON.parse(
      typeof window !== 'undefined'
        ? atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
        : Buffer.from(payload, 'base64').toString('utf8')
    ) as JwtPayload;

    return decoded;
  } catch (e) {
    console.error('Failed to parse JWT', e);
    return null;
  }
}
