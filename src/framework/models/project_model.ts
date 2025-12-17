export type TabProjectModel = {
  project_group_id: number;
  project_group_key: string;
  project_group_name: string;
  project_group_code: string;
  project_group_icon: string;
  project?: ProjectModel[];
};

export type ProjectModel = {
  project_id: number;
  project_group_id: number;

  project_title: string;
  project_description: string;
  img_url: string;
  live_url: string;
  is_code: boolean;
  code_url: string;
  stack_json?: string[];
  is_current_domain?: boolean;
};
