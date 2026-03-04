export interface Project {
  _id: string;
  name: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  documents?: string[];
}

export enum ProjectStatus {
  active = "active",
  inactive = "inactive",
}
