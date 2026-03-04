import { Collection, ObjectId } from "mongodb";
import {
  DBCollectionsEnum,
  database,
  getPaginatedDocuments,
} from "../models/mongoDb";
import {
  createDocument,
  deleteDocument,
  readDocument,
} from "../models/mongoDb/crudOperations";

import { Project } from "src/models/types/project";

const getProjectsCount = async () => {
  const collection: Collection<Project> = database.collection<Project>(
    DBCollectionsEnum.projects,
  );
  const documentsCount = await collection.countDocuments();

  return documentsCount;
};

const createProject = async (data: any) => {
  return await createDocument(data, DBCollectionsEnum.projects);
};

const getUserProjects = async (userId: string, page: number, limit: number) => {
  return await getPaginatedDocuments(
    { userId: userId } as any, // Assuming project has userId field to link to user
    DBCollectionsEnum.projects,
    { pageNumber: page, pageSize: limit },
  );
};

const getProjectById = async (projectId: string) => {
  return await readDocument(
    new ObjectId(projectId),
    DBCollectionsEnum.projects,
  );
};

const deleteProject = async (projectId: string) => {
  return await deleteDocument(projectId, DBCollectionsEnum.projects);
};

const ProjectServices = {
  getProjectsCount,
  createProject,
  getUserProjects,
  getProjectById,
  deleteProject,
};

export default ProjectServices;
