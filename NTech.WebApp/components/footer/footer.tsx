import { NavFooter } from "../../db/models";
import { MailchimpForm } from "../mailchimp/mailchimpForm";
import { NFooter, NCol, NRow, NContainer, NLink, Img } from "./footer.styles";

export const Footer = ({ data }: any) => {
  return (
    <NFooter className="footer">
      <NContainer>
        <NRow className="align-items-center">
          <MailchimpForm />
          <NCol size={12} sm={6}>
            <span className="logo-name">
              NJM<span>TECH</span>
            </span>
          </NCol>
          <NCol size={12} sm={6} className="text-center text-sm-end">
            <div className="social-icon">
              {data?.map((item: NavFooter, index: number) => {
                return (
                  <div key={index}>
                    <NLink
                      href={item.route_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Img
                        width={20}
                        height={20}
                        src={item.icon}
                        alt={item.name}
                      />
                    </NLink>
                  </div>
                );
              })}
            </div>
            <p>Copyright 2022. All Rights Reserved</p>
          </NCol>
        </NRow>
      </NContainer>
    </NFooter>
  );
};
