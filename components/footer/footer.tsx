import Image from 'next/image';
import { Col, Container, Row } from 'react-bootstrap';
import { MailchimpForm } from '../mailchimp/mailchimpForm';

export const Footer = ({ data }: any) => {
   return (
      <footer className="footer">
         <Container>
            <Row className="align-items-center">
               <MailchimpForm />
               <Col size={12} sm={6}>
                  <span className="logo-name">
                     NJM<span>TECH</span>
                  </span>
               </Col>
               <Col size={12} sm={6} className="text-center text-sm-end">
                  <div className="social-icon">
                     {data?.map((item: any, index: number) => {
                        return (
                           <div key={index}>
                              <a href={item.link} target="_blank" rel="noreferrer">
                                 <Image width={20} height={20} src={item.img_url} alt={item.alt_name} />
                              </a>
                           </div>
                        );
                     })}
                  </div>
                  <p>Copyright 2022. All Rights Reserved</p>
               </Col>
            </Row>
         </Container>
      </footer>
   );
};
