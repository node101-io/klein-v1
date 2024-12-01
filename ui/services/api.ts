import {
  FetchProjectByIdResponse,
  FetchProjectsResponse,
  Project,
  TransformedProject,
} from "@/types/projects.types";

export const fetchProjects = async (): Promise<TransformedProject[]> => {
  try {
    const response = await fetch("https://admin.klein.run/api/projects");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: FetchProjectsResponse = await response.json();

    const transformedNodes: TransformedProject[] = data.projects.map(
      (project) => ({
        id: project._id,
        name: project.name,
        status: project.properties.is_active ? "active" : "inactive",
        network: project.properties.is_mainnet ? "mainnet" : "testnet",
        image: project.image[0]?.url || "",
      })
    );

    return transformedNodes;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const fetchProjectById = async (id: string): Promise<Project> => {
  try {
    const response = await fetch(
      `https://admin.klein.run/api/projects/?id=${id}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: FetchProjectByIdResponse = await response.json();
    return data.project;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw error;
  }
};
