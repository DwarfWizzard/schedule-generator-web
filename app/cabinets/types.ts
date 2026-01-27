export enum CabinetType {
    practice = 0,
    lecture = 1,
    mixed = 2
}

export const cabinetTypeLabels: Record<CabinetType, string> = {
  [CabinetType.practice]:  "Кабинет для практических занятий",
  [CabinetType.lecture]: "Учебный кабинет",
  [CabinetType.mixed]: "Учебный кабинет и кабинет для практических занятий",
};

export interface CabinetEquipment {
  furniture: string;
  technical_means: string;
  computer_equipment: string;
}

export interface Cabinet {
  id: string;
  faculty_id: string;
  faculty_name: string;
  type: CabinetType;
  building: string;
  auditorium: string;
  suitable_for_peoples_with_special_needs: boolean;
  appointment?: string | null;
  equipment?: CabinetEquipment | null;
}