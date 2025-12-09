export interface Department {
  id: string;
  external_id: string;
  faculty_id: string;
  name: string;
  faculty_name: string;
}

export interface CreateDepartmentRequest {
  faculty_id?: string;
  external_id?: string;
  name: string;
}

export interface UpdateDepartmentRequest {
  external_id?: string;
  name?: string;
}

