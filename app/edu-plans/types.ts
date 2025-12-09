export interface EduPlan {
  id: string;
  direction_id: string;
  direction_name: string;
  profile: string;
  year: number;
  modules?: any[]; // Пока не интегрируем
}

export interface CreateEduPlanRequest {
  direction_id: string;
  profile: string;
  year: number;
}

