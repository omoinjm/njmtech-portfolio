import 'animate.css';
import Image from 'next/image';
import { Col, Container, Row, SSRProvider } from 'react-bootstrap';
import TrackVisibility from 'react-on-screen';
import { Service } from './services.styles';

export const Services = ({ data }: any) => {
  return (
    <SSRProvider>
      <Service className="services" id="services">
        <Container>
          <Row>
            <Col size={12}>
              <TrackVisibility>
                {({ isVisible }) => (
                  <div className={isVisible ? 'animate__animated animate__fadeIn' : ''}>
                    <h2>Services</h2>
                    <p>
                      Professional services to help your business grow. Explore the offerings below.
                    </p>
                  </div>
                )}
              </TrackVisibility>
            </Col>
          </Row>

          <Row>
            {data.map((s: any, i: number) => (
              <Col size={12} sm={6} md={4} key={i}>
                <div className="proj-imgbx">
                  <Image
                    src="https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064213/public/images/scattered-forcefields_wqqd7m.svg"
                    alt={s.title}
                    width={5}
                    height={5}
                  />

                  <div className="proj-txtx">
                    <h4 className="title-row">{s.title}</h4>

                    <div className="desc-tags-row">
                      <span className="description">{s.description}</span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </Service>
    </SSRProvider>
  );
};
