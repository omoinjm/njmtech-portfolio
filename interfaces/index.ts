export interface IAge {
	age: number;
	today: Date;
	birthDate: Date;
}

export interface ILinks {
	page_links?: IRoutes[];
	footer_links?: IFooter[];
}

export interface IRoutes {
	id: number;
	link: string;
	name: string;
}

export interface IFooter {
	id: number;
	link: string;
	img_url: string;
	alt_name: string;
}

export interface IForm {
	name: string;
	sent: boolean;
	email: string;
	subject: string;
	message: string;
}

export interface ISkills {
	id: number;
	img_url: string;
	img_name: string;
}

export interface ITabProjects {
	id: number;
	tab_key: string;
	tab_name: string;
	project?: IProjects[];
	icon: string;
}

export interface IProjects {
	id: number;
	title: string;
	description: string;
	img_url: string;
	live: string;
	code_visibility: boolean;
	code_url: string;
	stack?: IStack[];
}

interface IStack {
	stack: string[];
}
  
