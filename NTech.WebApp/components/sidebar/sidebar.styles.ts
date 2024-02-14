import { AiOutlineClose } from 'react-icons/ai';
import { Link as LinkS } from 'react-scroll';
import styled from 'styled-components';

export const SidebarContainer = styled.aside<{ isOpen?: boolean }>`
	position: fixed;
	z-index: 9999;
	width: 100%;
	height: 100%;
	background: #0d0d0d;
	display: grid;
	align-items: center;
	top: 0;
	left: 0;
	transition: 0.3s ease-in-out;
	opacity: ${({ isOpen }) => (isOpen ? '100%' : '0')};
	top: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
	overflow: hidden;
`;

export const CloseIcon = styled(AiOutlineClose)`
	color: #fff;
`;

export const Icon = styled.div`
	position: absolute;
	top: 1.2rem;
	right: 1.5rem;
	background: transparent;
	font-size: 2rem;
	cursor: pointer;
	outline: none;
`;

export const SidebarWrapper = styled.div`
	color: #fff;
`;

export const SidebarMenu = styled.ul`
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: repeat(6, 80px);
	text-align: center;

	@media screen and (max-width: 480px) {
		grid-template-rows: repeat(6, 60px);
	}
`;

export const SidebarLink = styled(LinkS)`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.5rem;
	text-decoration: none;
	list-style: none;
	transition: 0.2s ease-in-out;
	text-decoration: none;
	color: #fff;
	cursor: pointer;

	&:hover {
		color: #4831d4;
		transition: 0.2s ease-in-out;
	}
`;
export const SideBtnWrap = styled.div`
	display: flex;
	justify-content: center;
`;

export const SidebarRoute = styled.a`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 4%;
	border-radius: 50px;
	background: #4831d4;
	white-space: nowrap;
	padding: 16px 64px;
	color: #fff;
	font-size: 16px;
	outline: none;
	border: none;
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	text-decoration: none;

	&:hover {
		transition: all 0.2s ease-in-out;
		background: #fff;
		color: #000;
	}
`;
