import Image from 'next/image';
import styled from 'styled-components';

export const Img = styled(Image)`
	width: 100%;
	animation: updown 3s linear infinite;

	@keyframes updown {
		0% {
			transform: translateY(-20px);
		}
		50% {
			transform: translateY(20px);
		}
		100% {
			transform: translateY(-20px);
		}
	}
`;
