import { FooterModel } from '@/framework/models/link_model';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { MailchimpForm } from '../mailchimp/mailchimpForm';

export const Footer = ({ data }: any) => {
  const router = useRouter();
  const [showSub, setSub] = useState<boolean | null>(null);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Check if the current pathname matches any of the specified routes
    if (['/contact', '/projects', '/services'].some((path) => router.pathname.includes(path))) {
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
            <Image src="/logo.svg" alt="NJMTECH Logo" width={300} height={150} priority />
          </Col>
          <Col size={12} sm={6} className="text-center text-sm-end">
            <div className="social-icon">
              {data?.map((item: FooterModel, index: number) => {
                return (
                  <div key={index}>
                    <Link href={item.route_url} target="_blank" rel="noreferrer">
                      <Image width={20} height={20} src={item.icon} alt={item.name} />
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
