import styled from 'styled-components';

export const Stack = styled.div`
	ul {
		list-style-type: none;
		margin-top: 1em;
		margin-left: 0;
		padding-left: 0;
		position: relative;
		display: flex;
		justify-content: center;
		gap: 10px;

		li {
			padding: 10px;
			border: 1px solid #fff;
			border-radius: 10px;
			font-weight: 100;
		}
	}
`;

export const Icons = styled.aside`
	position: absolute;
	right: 20px;
	top: -70px;
	display: flex;
	gap: 20px;
	margin-right: 5px;

	a {
		color: #fff;

		&:hover {
			color: #75757575;
		}
	}
`;
