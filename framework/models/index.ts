export type IAge = {
  age: number;
  today: Date;
  birthDate: Date;
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
