import { useEffect, useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { MobileIcon } from './navbar.styles';

export const NavBar = ({ toggle, data }: any) => {
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      window.scrollY > 50 ? setScrolled(true) : setScrolled(false);
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onUpdateActiveLink = (value: any) => {
    setActiveLink(value);
  };

  return (
    <Navbar expand="md" className={scrolled ? 'scrolled' : ''}>
      <Container>
        <Navbar.Brand>
          <Link href="/">
            <Image src="/logo.svg" alt="NJMTECH Logo" width={1000} height={100} priority />
          </Link>
        </Navbar.Brand>
        <MobileIcon onClick={toggle}>
          <div />
        </MobileIcon>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {data?.map((option: any, index: number) => {
              return (
                <div key={index}>
                  <Link
                    href={option.route_url}
                    className={
                      activeLink === `${option.route_url}` ? 'active navbar-link' : 'navbar-link'
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
