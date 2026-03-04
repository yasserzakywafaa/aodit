import { Project } from "src/shared/types/project";

export interface DashboardCreateProjectState {
  isFetching: boolean;
  project: Project;
}

export const getDashboardCreateProjectInitialState =
  (): DashboardCreateProjectState => {
    return {
      isFetching: false,
      project: {
        _id: "",
        name: "",
        description: "",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Project,
    };
  };
