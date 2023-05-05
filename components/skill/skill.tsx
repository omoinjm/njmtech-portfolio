import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import getAge from "../../utils";
import { About } from "./skill.styles";

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
    <section className="skill" id="skill">
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
                      <Image
                        width={40}
                        height={40}
                        src={item.imgUrl}
                        alt={item.imgName}
                      />
                      <h5>{item.imgName}</h5>
                    </div>
                  );
                })}
              </Carousel>
            </div>
            <About>
              <h2>About</h2>
              <p>
                As an experienced software engineer, I specialize in web
                development and have a passion for continuous learning and
                improvement. My interest in software engineering began at a
                young age, as I was consistently curious about understanding the
                intricacies of how things work.
              </p>
              <p>
                In high school, I tutored a Computer Applications Technology
                class as part of my extracurricular activities. Since then, I
                have continued to pursue my passion for software engineering
                through self-studying, side projects, university courses,
                industry certifications, and work experience.
              </p>
              <p>
                My career began as a web developer for a South African modeling
                agency, where I gained experience in creating high-quality web
                applications. I then worked as a developer for a start-up social
                networking company, where I contributed to the development of
                innovative web features. Most recently, I have worked as a
                Junior Software Engineer at{" "}
                <a
                  href="https://www.rysis.co.za/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Rysis Software"
                >
                  Rysis Software
                </a>{" "}
                , where I have honed my skills in web development and software
                engineering.
              </p>
              <p>
                I am committed to continuous self-improvement and sharing my
                knowledge and experiences with others. For example, I have
                developed this portfolio website where I showcase my development
                skills and provide resources for other aspiring software
                engineers. Through my dedication to learning and teaching, I
                have become proficient in a variety of programming languages,
                frameworks, and tools.
              </p>
            </About>
          </div>
        </div>
      </div>
      <Image
        width={40}
        height={40}
        className="background-image-left"
        src="https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064195/public/assets/color-sharp_u65iaw.png"
        alt="Background"
      />
    </section>
  );
};
