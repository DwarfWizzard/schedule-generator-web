export interface Teacher {
  id: string;
  external_id: string;
  name: string;
  position: string;
  degree: string;
  department_id: string;
}

export interface CreateTeacherRequest {
  department_id: string;
  external_id: string;
  name: string;
  position: string;
  degree: string;
}

