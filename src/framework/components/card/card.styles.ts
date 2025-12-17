import Image from "next/image";
import styled from "styled-components";

export const Img = styled.img`
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: scroll;
`;

export const Stack = styled.div`
  padding: 1.2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: white;

  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .title-row {
    font-size: 1.3rem;
    font-weight: 600;
    margin: 0;
  }

  .icons-row {
    display: flex;
    justify-content: flex-start;
    gap: 16px;
    font-size: 1.4rem;

    margin-left: auto;

    a {
      color: #fff;
      transition: 0.25s ease;

      &:hover {
        color: #b5b5b5;
      }
    }

    svg {
      cursor: pointer;
    }
  }

  .desc-tags-row {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .description {
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .tags {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;

    li {
      padding: 8px 12px;
      border: 1px solid #ffffffa8;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 300;
    }
  }

  @media (min-width: 576px) and (max-width: 992px) {
    .icons-row {
      font-size: 1.2rem;
      gap: 14px;
    }

    .title-row {
      font-size: 1.15rem;
    }

    .description {
      font-size: 0.9rem;
    }

    .tags li {
      padding: 6px 10px;
      font-size: 0.75rem;
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
