import Image from 'next/image';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import getAge from '../../utils';
import { About, Skill } from './skill.styles';

export const Skills = ({ data }: any) => {
   const responsive = {
      superLargeDesktop: {
         // the naming can be any, depends on you.
         breakpoint: { max: 4000, min: 3000 },
         items: 5,
      },
      desktop: {
         breakpoint: { max: 3000, min: 1024 },
         items: 3,
      },
      tablet: {
         breakpoint: { max: 1024, min: 464 },
         items: 2,
      },
      mobile: {
         breakpoint: { max: 464, min: 0 },
         items: 1,
      },
   };

   return (
      <Skill className="skill" id="skill">
         <div className="container">
            <div className="row">
               <div className="col-12">
                  <div className="skill-bx wow zoomIn">
                     <h2>Top Skills</h2>
                     <p>
                        I&apos;m skilled in responsive design, search engine
                        optimization, SQL database management, version control with git,
                        API architecture, and a familiarity with server-side
                        development.
                     </p>
                     <Carousel
                        responsive={responsive}
                        infinite={true}
                        ssr={true}
                        autoPlay={true}
                        autoPlaySpeed={2000}
                        arrows={false}
                        className="owl-carousel owl-theme skill-slider"
                     >
                        {data?.map((item: any, index: number) => {
                           return (
                              <div className="item" key={index}>
                                 <Image width={40}
                                    height={40} src={item.imgUrl} alt={item.imgName} />
                                 <h5>{item.imgName}</h5>
                              </div>
                           );
                        })}
                     </Carousel>
                  </div>
                  <About>
                     <h2>About</h2>
                     <p>
                        {' '}
                        I&apos;m a {getAge()} year old Software Engineer, mainly focused
                        in <strong>Web Developement</strong>. My passion has evolved
                        from my childhood days of consistent curiosity and understanding
                        the intricacies of how things work.
                        <br />
                        <br />
                        As a high school senior, I was involved in Tech Club
                        extracurricular activities and although my participation was
                        short-lived, I&apos;ve continued to pursue my passion for Web
                        Development through self-studying, side projects, university
                        courses, industry certifications, and work experience.
                        <br />
                        <br /> I started my career freelancing as a Web Designer for a
                        South African modeling agency and have since worked in a couple
                        of developement positions including one as a Frontend Web
                        Developer at a start up Social Networking Company and most
                        recently working as an intern Full Stack Web Developer at{' '}
                        <a
                           href="https://www.rysis.co.za/"
                           target="_blank"
                           rel="noreferrer"
                           aria-label="Rysis Software"
                        >
                           Rysis Software
                        </a>{' '}
                        .
                     </p>
                  </About>
               </div>
            </div>
         </div>
      </Skill>
   );
};
