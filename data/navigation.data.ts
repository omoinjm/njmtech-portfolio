import { IFooter, IRoutes } from '../interfaces';

/***************** NAVBAR *****************/

export const pageLinks: IRoutes[] = [
	{ id: 0, link: 'skill', name: 'Skills' },
	{ id: 1, link: 'project', name: 'Portfolio' },
	{ id: 2, link: 'contact', name: 'Contact' },
];

/***************** FOOTER *****************/

export const footerLinks: IFooter[] = [
	{
		id: 0,
		link: 'https://www.linkedin.com/in/njmalaza',
		imgUrl: '/logo/nav-icon1.svg',
		altName: 'LinkedIn',
	},
	{
		id: 1,
		link: 'https://www.facebook.com/',
		imgUrl: '/logo/nav-icon2.svg',
		altName: 'Facebook',
	},
	{
		id: 2,
		link: 'https://www.instagram.com/',
		imgUrl: '/logo/nav-icon3.svg',
		altName: 'Imstagram',
	},
];
