import 'animate.css';
import Image from 'next/image';
import { SSRProvider, Col, Container, Nav, Row, Tab } from 'react-bootstrap';
import TrackVisibility from 'react-on-screen';
import { projectTabs } from '../../data';
import { ProjectCard } from '../card/card';
import { Wrapper } from './project.styles';

export const Projects = () => {
   return (
      <SSRProvider>
         <section className="project" id="project">
            <Container>
               <Row>
                  <Col size={12}>
                     <TrackVisibility>
                        {({ isVisible }) => (
                           <div
                              className={
                                 isVisible ? 'animate__animated animate__fadeIn' : ''
                              }
                           >
                              <h2>Projects</h2>
                              <p>
                                 I&apos;ve continuously dedicated myself to constant
                                 self-improvement and helping others learn through my
                                 knowledge, experiences and showcasing my developement skills
                                 via this portfolio website.
                              </p>
                              <Tab.Container id="projects-tabs" defaultActiveKey="first">
                                 <Nav
                                    variant="pills"
                                    className="nav-pills mb-5 justify-content-center align-items-center"
                                    id="pills-tab"
                                 >
                                    {projectTabs.map((item, index) => {
                                       return (
                                          <Wrapper className="wrapper" key={index}>
                                             <Nav.Item>
                                                <Nav.Link title={item.tabName} eventKey={item.tabKey}>
                                                   <i className={`${item.icon} icons`}></i>
                                                </Nav.Link>
                                             </Nav.Item>
                                          </Wrapper>
                                       );
                                    })}
                                 </Nav>
                                 <Tab.Content
                                    id="slideInUp"
                                    className={
                                       isVisible ? 'animate__animated animate__slideInUp' : ''
                                    }
                                 >
                                    {projectTabs.map((item: any, index: number) => {
                                       return (
                                          <Tab.Pane eventKey={item.tabKey} key={index}>
                                             <Row>
                                                {item.project.map((project: any, index: number) => {
                                                   return <ProjectCard key={index} {...project} />;
                                                })}
                                             </Row>
                                          </Tab.Pane>
                                       );
                                    })}
                                 </Tab.Content>
                              </Tab.Container>
                           </div>
                        )}
                     </TrackVisibility>
                  </Col>
               </Row>
            </Container>
            <Image
               width={40} height={40}
               className="background-image-right"
               src='/assets/color-sharp2.png'
               alt="Background"
            />
         </section>
      </SSRProvider>
   );
};
