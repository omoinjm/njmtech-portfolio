export interface ILinks {
  page_links?: NavMenu[];
  footer_links?: NavFooter[];
}

export interface NavMenu {
  id: number;
  name: string;
  icon: string;
  route_url: string;
  is_active: boolean;
}

export interface NavFooter {
  id: number;
  name: string;
  icon: string;
  route_url: string;
  is_active: boolean;
}

export type IAge = {
  age: number;
  today: Date;
  birthDate: Date;
};

export type IForm = {
  name: string;
  sent: boolean;
  email: string;
  subject: string;
  message: string;
};

export type ISkills = {
  id: number;
  img_url: string;
  img_name: string;
};

export type ITabProjects = {
  id: number;
  tab_key: string;
  tab_name: string;
  project?: IProjects[];
  icon: string;
};

export type IProjects = {
  id: number;
  title: string;
  description: string;
  img_url: string;
  live: string;
  code_visibility: boolean;
  code_url: string;
  stack?: IStack[];
};

type IStack = {
  stack: string[];
};
