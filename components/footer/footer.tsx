import { NavFooter } from "../../db/models";
import { MailchimpForm } from "../mailchimp/mailchimpForm";
import { FooterContainer, Cols, Rows, Containers } from "./footer.styles";

export const Footer = ({ data }: any) => {
  return (
    <FooterContainer className="footer">
      <Containers>
        <Rows className="align-items-center">
          <MailchimpForm />
          <Cols size={12} sm={6}>
            <span className="logo-name">
              NJM<span>TECH</span>
            </span>
          </Cols>
          <Cols size={12} sm={6} className="text-center text-sm-end">
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
            <p>Copyright 2022. All Rights Reserved</p>
          </Cols>
        </Rows>
      </Containers>
    </FooterContainer>
  );
};
