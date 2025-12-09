export interface EduDirection {
  id: string;
  name: string;
  department_id: string;
  department_name: string;
}

export interface CreateEduDirectionRequest {
  name: string;
  department_id: string;
}

export interface UpdateEduDirectionRequest {
  name?: string;
}

