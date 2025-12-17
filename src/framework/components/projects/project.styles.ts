import styled from "styled-components";

export const Project = styled.section`
  background-image: url("https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064195/public/assets/color-sharp_u65iaw.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: scroll;
`;

export const Wrapper = styled.div`
  ${
    "" /* .icon {
		position: relative;
		cursor: pointer;
		z-index: 3;
		transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);

		span {
			position: relative;
			z-index: 3;
		}

		.tooltip {
			position: absolute;
			top: 0;
			color: #fff;
			background: #fff;
			padding: 10px 18px;
			border-radius: 25px;
			box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
			pointer-events: none;
			opacity: 0;
			transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
			z-index: 99999999;

			&::before {
				content: '';
				position: absolute;
				background: #fff;
				left: 50%;
				bottom: -8px;
				transform: translate(-50%) rotate(45deg);
				transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
			}
		}

		&:hover .tooltip {
			top: -70px;
			left: 50%;
			opacity: 1;
			pointer-events: auto;
		}

		&:hover span,
		&:hover .tooltip {
			text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.5);
		}
	} */
  }
`;
