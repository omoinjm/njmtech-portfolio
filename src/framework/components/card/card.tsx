import Link from "next/link";
import { Col } from "react-bootstrap";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { VscGithub } from "react-icons/vsc";
import { Icons, Img, Stack } from "./card.styles";

export const ProjectCard = ({
  live_url,
  project_title,
  stack_json,
  img_url,
  code_url,
  project_description,
  is_code,
  is_current_domian,
}: any) => {
  return (
    <Col size={12} sm={6} md={4}>
      <div className="proj-imgbx">
        <Img src={img_url} alt={project_title} />

        <Stack className="proj-txtx">
          {/* Row 1 — Icons */}
          <div className="icons-row">
            {is_code && (
              <a href={code_url} target="_blank" rel="noreferrer">
                <VscGithub />
              </a>
            )}

            {is_current_domian ? (
              <Link href={live_url}>
                <BsBoxArrowUpRight />
              </Link>
            ) : (
              <a href={live_url} target="_blank" rel="noreferrer">
                <BsBoxArrowUpRight />
              </a>
            )}
          </div>

          <div className="content sm:m-1 md:m-1 lg:m-5">
            {/* Row 2 — Title */}
            <h4 className="title-row mt-5">{project_title}</h4>

            {/* Row 3 — Description + tags */}
            <div className="desc-tags-row">
              <span className="description">{project_description}</span>

              <ul className="tags">
                {stack_json.map((item: any, index: any) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Stack>
      </div>
    </Col>
  );
};
