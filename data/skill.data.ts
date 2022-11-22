import { CiGlobe, CiSettings, CiShoppingCart } from 'react-icons/ci';
import { ISkills, ITabProjects } from '../interfaces';
import {
	appProjects,
	eCommerceProjects,
	webSiteProjects,
} from './project.data';

/***************** SKILLS *****************/

export const skillImg: ISkills[] = [
	{ id: 0, imgUrl: '/icon/react.svg', imgName: 'React' },
	{ id: 1, imgUrl: '/icon/csharp.svg', imgName: 'C#' },
	{ id: 2, imgUrl: '/icon/vscode.svg', imgName: 'VS Code' },
	{ id: 3, imgUrl: '/icon/postman.svg', imgName: 'Postman' },
	{ id: 4, imgUrl: '/icon/typescript.svg', imgName: 'Typescript' },
	{ id: 5, imgUrl: '/icon/nodejs.svg', imgName: 'Node JS' },
	{ id: 6, imgUrl: '/icon/docker.svg', imgName: 'Docker' },
	{ id: 7, imgUrl: '/icon/sql.svg', imgName: 'SQL' },
];

/***************** PROJECTS *****************/

export const projectTabs: ITabProjects[] = [
	{
		id: 0,
		tabKey: 'first',
		tabName: 'Web Site',
		project: webSiteProjects,
		icon: CiGlobe,
	},
	{
		id: 1,
		tabKey: 'second',
		tabName: 'App',
		project: appProjects,
		icon: CiSettings,
	},
	{
		id: 2,
		tabKey: 'third',
		tabName: 'E-Commerce',
		project: eCommerceProjects,
		icon: CiShoppingCart,
	},
];
