export interface EduGroup {
  id: string;
  number: string;
  edu_plan_id: string;
  profile: string;
  admission_year: number;
}

export interface CreateEduGroupRequest {
  number: string;
  edu_plan_id: string;
}

export interface UpdateEduGroupRequest {
  number?: string;
}

