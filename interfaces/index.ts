export interface IAge {
	birthDate: Date;
	today: Date;
	age: number;
}

export interface ILinks {
	pageLinks?: IRoutes[];
	footerLinks?: IFooter[];
}

export interface IRoutes {
	id: number;
	link: string;
	name: string;
}

export interface IFooter {
	id: number;
	link: string;
	imgUrl: string;
	altName: string;
}

export interface IForm {
	name: string;
	email: string;
	subject: string;
	message: string;
	sent: boolean;
}

export interface ISkills {
	id: number;
	imgUrl: string;
	imgName: string;
}

export interface IButton {
	primary?: boolean;
	big?: boolean;
	dark?: boolean;
	fontBig?: boolean;
}

export interface ITabProjects {
	id: number;
	tabKey: string;
	tabName: string;
	project?: IProjects[];
	icon: string;
}

export interface IProjects {
	id: number;
	title: string;
	description: string;
	imgUrl: string;
	live: string;
	codeV: boolean;
	code: string;
	stack?: IStack[];
}

interface IStack {
	name: string;
	icon: string;
}
