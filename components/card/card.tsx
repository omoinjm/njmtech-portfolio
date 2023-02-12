import { Col } from 'react-bootstrap';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import { VscGithub } from 'react-icons/vsc';
import { Icons, Img, Stack } from './card.styles';

export const ProjectCard = ({
   title,
   description,
   imgUrl,
   codeV,
   code,
   live,
   stack,
}: any) => {
   return (
      <Col size={12} sm={6} md={4}>
         <div className="proj-imgbx">
            <Img src={imgUrl} alt={title} />
            <Stack className="proj-txtx">
               <Icons>
                  {codeV ? (
                     <a
                        href={code}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub"
                     >
                        {<VscGithub />}
                     </a>
                  ) : (
                     ''
                  )}
                  <a
                     href={live}
                     target="_blank"
                     rel="noreferrer"
                     aria-label="Live site"
                  >
                     {<BsBoxArrowUpRight />}
                  </a>
               </Icons>
               <h4>{title}</h4>
               <span>{description}</span>
               <ul>
                  {stack.map((option: any, index: any) => {
                     return (
                        <div key={index}>
                           <li>{option.name}</li>
                        </div>
                     );
                  })}
               </ul>
            </Stack>
         </div>
      </Col>
   );
};
