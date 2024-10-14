import Link from 'next/link'
import { Col } from 'react-bootstrap';
import { VscGithub } from 'react-icons/vsc';
import { Icons, Img, Stack } from './card.styles';
import { BsBoxArrowUpRight } from 'react-icons/bs';

export const ProjectCard = ({
   live,
   title,
   stack,
   img_url,
   code_url,
   description,
   code_visibility,
   is_current_domian
}: any) => {
   return (
      <Col size={12} sm={6} md={4}>
         <div className="proj-imgbx">
            <Img src={img_url} alt={title} />
            <Stack className="proj-txtx">
               <Icons>
                  {code_visibility ? (
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
                        href={live}
                        
                     >
                        {<BsBoxArrowUpRight />}
                     </Link>
                  ) : (
                     <a
                        href={live}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Live site"
                     >
                     {<BsBoxArrowUpRight />}
                     </a>
                  )}
                  
               </Icons>
               <h4>{title}</h4>
               <span>{description}</span>
               <ul>
                  {stack.map((option: any, index: any) => {
                     return (
                        <div key={index}>
                           <li>{option}</li>
                        </div>
                     );
                  })}
               </ul>
            </Stack>
         </div>
      </Col>
   );
};
