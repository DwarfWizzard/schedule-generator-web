export interface JwtPayload {
  exp: number;
  iat: number;
  user_id: string;
  user_name: string
  user_role: number;
}

export function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      )
      .join('')
  );

  return JSON.parse(jsonPayload);
}
