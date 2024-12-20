export interface Image {
  url: string;
  width: number;
  height: number;
}

export interface ProjectProperties {
  is_active: boolean;
  is_incentivized: boolean;
  is_mainnet: boolean;
  is_visible: boolean;
}

export interface SystemRequirements {
  cpu?: string;
  ram?: string;
  storage?: string;
  os?: string;
}

export interface Translations {
  [languageCode: string]: {
    name: string;
    description: string;
  };
}

export interface Urls {
  web: string;
}

export interface Project {
  _id: string;
  name: string;
  chain_registry_identifier: string;
  description: string;
  image: Image[];
  non_generic_tx_commands: any[];
  properties: ProjectProperties;
  system_requirements: SystemRequirements;
  urls: Urls;
  translations: Translations;
  is_completed: boolean;
}

export interface FetchProjectsResponse {
  success: boolean;
  projects: Project[];
  count: number;
  limit: number;
  page: number;
  search: string | null;
}

export interface FetchProjectByIdResponse {
  success: boolean;
  project: Project;
}

export interface TransformedProject {
  id: string;
  name: string;
  status: "active" | "inactive";
  network: "mainnet" | "testnet";
  image: string;
}
