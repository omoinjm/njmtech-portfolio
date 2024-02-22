import { NavFooter } from "../../db/models";
import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import { MailchimpForm } from "../mailchimp/mailchimpForm";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export const Footer = ({ data }: any) => {
  const router = useRouter();
  const [showSub, setSub] = useState<boolean | null>(null);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Check if the current pathname matches any of the specified routes
    if (
      router.pathname.includes("/contact") ||
      router.pathname.includes("/services") ||
      router.pathname.includes("/projects")
    ) {
      // Set the state to true if the condition is met
      setSub(false);
    } else {
      setSub(true);
    }
  }, [router.pathname]); // Run this effect when the pathname changes

  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center">
          {showSub ? <MailchimpForm /> : <div className="mt-5"></div>}
          <Col size={12} sm={6}>
            <span className="logo-name">
              NJM<span>TECH</span>
            </span>
          </Col>
          <Col size={12} sm={6} className="text-center text-sm-end">
            <div className="social-icon">
              {data?.map((item: NavFooter, index: number) => {
                return (
                  <div key={index}>
                    <Link
                      href={item.route_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Image
                        width={20}
                        height={20}
                        src={item.icon}
                        alt={item.name}
                      />
                    </Link>
                  </div>
                );
              })}
            </div>
            <p>Copyright {currentYear}. All Rights Reserved</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
