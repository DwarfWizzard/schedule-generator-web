export enum UserRole {
    admin = 1,
    deputy_dean = 0
};

export const userRolesLabels: Record<UserRole, string> = {
  [UserRole.admin]:  "Администратор",
  [UserRole.deputy_dean]: "Заместитель декана",
};

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  faculty_id?: string;
  faculty_name?: string;
};

