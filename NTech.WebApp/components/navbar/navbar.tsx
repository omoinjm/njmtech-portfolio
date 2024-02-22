import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { AiOutlineBars } from "react-icons/ai";
import Link from "next/link";
import { MobileIcon } from "./navbar.styles";

export const NavBar = ({ toggle, data }: any) => {
  const [activeLink, setActiveLink] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      window.scrollY > 50 ? setScrolled(true) : setScrolled(false);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onUpdateActiveLink = (value: any) => {
    setActiveLink(value);
  };

  return (
    <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
      <Container>
        <Navbar.Brand>
          <Link href="/">
            <span className="logo-name">
              NJM<span>TECH</span>
            </span>
          </Link>
        </Navbar.Brand>
        <MobileIcon onClick={toggle}>
          <AiOutlineBars />
        </MobileIcon>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {data?.map((option: any, index: number) => {
              return (
                <div key={index}>
                  <Link
                    href={option.route_url}
                    className={
                      activeLink === `${option.route_url}`
                        ? "active navbar-link"
                        : "navbar-link"
                    }
                    onClick={() => onUpdateActiveLink(`${option.route_url}`)}
                  >
                    {option.name}
                  </Link>
                </div>
              );
            })}
          </Nav>
          <span className="navbar-text">
            <a
              href="https://njmbio.vercel.app/"
              target="_blank"
              aria-label="Links"
              rel="noreferrer"
            >
              <button className="vvd">
                <span>Links</span>
              </button>
            </a>
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
