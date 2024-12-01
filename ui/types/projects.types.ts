// Define a type for an image object
export interface Image {
  url: string;
  width: number;
  height: number;
}

// Define a type for the project properties
export interface ProjectProperties {
  is_active: boolean;
  is_incentivized: boolean;
  is_mainnet: boolean;
  is_visible: boolean;
}

// Define a type for system requirements
export interface SystemRequirements {
  cpu?: string;
  ram?: string;
  storage?: string;
  os?: string;
}

// Define a type for translations
export interface Translations {
  [languageCode: string]: {
    name: string;
    description: string;
  };
}

// Define a type for URLs
export interface Urls {
  web: string;
}

// Define a type for a single project
export interface Project {
  _id: string;
  name: string;
  chain_registry_identifier: string;
  description: string;
  image: Image[];
  non_generic_tx_commands: any[]; // Replace with a specific type if needed
  properties: ProjectProperties;
  system_requirements: SystemRequirements;
  urls: Urls;
  translations: Translations;
  is_completed: boolean;
}

// Define a type for the API response for fetching all projects
export interface FetchProjectsResponse {
  success: boolean;
  projects: Project[];
  count: number;
  limit: number;
  page: number;
  search: string | null;
}

// Define a type for the API response for fetching a single project by ID
export interface FetchProjectByIdResponse {
  success: boolean;
  project: Project;
}

// Define a transformed project type for your `fetchProjects` function
export interface TransformedProject {
  id: string;
  name: string;
  status: "active" | "inactive";
  network: "mainnet" | "testnet";
  image: string;
}
