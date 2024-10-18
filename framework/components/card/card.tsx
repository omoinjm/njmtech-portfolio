import Link from 'next/link';
import { Col } from 'react-bootstrap';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import { VscGithub } from 'react-icons/vsc';
import { Icons, Img, Stack } from './card.styles';

export const ProjectCard = ({
   live_url,
   project_title,
   stack_json,
   img_url,
   code_url,
   project_description,
   is_code,
   is_current_domian
}: any) => {
   return (
      <Col size={12} sm={6} md={4}>
         <div className="proj-imgbx">
            <Img src={img_url} alt={project_title} />
            <Stack className="proj-txtx">
               <Icons>
                  {is_code ? (
                     <a
                        href={code_url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub"
                     >
                        {<VscGithub />}
                     </a>
                  ) : (
                     ''
                  )}

                  {is_current_domian ? (
                     <Link
                        href={live_url}

                     >
                        {<BsBoxArrowUpRight />}
                     </Link>
                  ) : (
                     <a
                        href={live_url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Live site"
                     >
                        {<BsBoxArrowUpRight />}
                     </a>
                  )}

               </Icons>
               <h4>{project_title}</h4>
               <span>{project_description}</span>
               <ul>
                  {stack_json.map((item: any, index: any) => {
                     return (
                        <div key={index}>
                           <li>{item}</li>
                        </div>
                     );
                  })}
               </ul>
            </Stack>
         </div>
      </Col>
   );
};
