import 'animate.css';
import { createContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { ArrowRightCircle } from 'react-bootstrap-icons';
import TrackVisibility from 'react-on-screen';
import { Cursor } from 'react-simple-typewriter';
import { Img } from './hero.styles';

export const ThemeContext = createContext<any>(null);

export const Hero = () => {
   const [theme, setTheme] = useState("dark")
   const [loopNum, setLoopNum] = useState(0);
   const [isDeleting, setIsDeleting] = useState(false);
   const [text, setText] = useState('');
   const [delta, setDelta] = useState(300 - Math.random() * 100);
   const [index, setIndex] = useState(1);

   const toggleTheme = () => {
      setTheme((curr) => (curr === "dark" ? "light" : "dark"));
   }

   const toRotate = [
      'Software Developer',
      'DevOps Engineer',
      'UI/UX Designer',
   ];
   const period = 500;

   useEffect(() => {
      let ticker = setInterval(() => {
         tick();
      }, delta);

      return () => {
         clearInterval(ticker);
      };
   });

   const tick = () => {
      let i = loopNum % toRotate.length;
      let fullText = toRotate[i];
      let updatedText = isDeleting
         ? fullText.substring(0, text.length - 1)
         : fullText.substring(0, text.length + 1);

      setText(updatedText);

      if (isDeleting) {
         setDelta((prevDelta) => prevDelta / 2);
      }

      if (!isDeleting && updatedText === fullText) {
         setIsDeleting(true);
         setIndex((prevIndex) => prevIndex - 1);
         setDelta(period);
      } else if (isDeleting && updatedText === '') {
         setIsDeleting(false);
         setLoopNum(loopNum + 1);
         setIndex(1);
         setDelta(500);
      } else {
         setIndex((prevIndex) => prevIndex + 1);
      }
   };

   return (
      <ThemeContext.Provider value={{ theme, setTheme }}>
         <section className="banner" id={theme}>
            <Container>
               <Row className="aligh-items-center">
                  <Col xs={12} md={6} xl={7}>
                     <TrackVisibility>
                        {({ isVisible }) => (
                           <div
                              className={
                                 isVisible ? 'animate__animated animate__fadeIn' : ''
                              }
                           >
                              <span className="tagline">Nhlanhla Junior Malaza</span>
                              <h1>
                                 I&apos;m a <span>{text}</span>
                                 <Cursor />.
                              </h1>
                              <p>
                                 A passionate software developer, willing to learn and adapt
                                 to any software environment. I am always striving to improve
                                 myself and my skills. I enjoy working with others and within
                                 a team.
                              </p>
                              <button onClick={() => console.log('connect')}>
                                 <a
                                    href="https://resume.io/r/xIyIsoKTH"
                                    target="_blank"
                                    aria-label="Resume"
                                    rel="noreferrer"
                                 >
                                    View Resume <ArrowRightCircle size={25} />
                                 </a>
                              </button>
                           </div>
                        )}
                     </TrackVisibility>
                  </Col>
                  <Col xs={12} md={6} xl={5}>
                     <TrackVisibility>
                        {({ isVisible }) => (
                           <div
                              className={
                                 isVisible ? 'animate__animated animate__zoomIn' : ''
                              }
                           >
                              <Img width={20} height={20} src='https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064224/public/assets/Saly-13_kwjz95.svg' alt="Header Img" />
                           </div>
                        )}
                     </TrackVisibility>
                  </Col>
               </Row>
            </Container>
         </section>
      </ThemeContext.Provider >
   );
};
