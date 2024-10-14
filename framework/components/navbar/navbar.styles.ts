import styled from 'styled-components';

export const MobileIcon = styled.div`
	display: none;

	@media screen and (max-width: 768px) {
		display: block;
		position: absolute;
		top: 0;
		right: 0;
		transform: translate(-100%, 0);
		font-size: 1.8rem;
		font-weight: 100;
		cursor: pointer;
	}
`;
