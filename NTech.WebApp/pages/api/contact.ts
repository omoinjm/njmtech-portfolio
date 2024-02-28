// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import { BaseComponent } from "../../framework/base/base.component";
import { ContactFormModel } from "../../framework/models/contact_model";

class ContactService extends BaseComponent {
  private getContactTemplate = async (): Promise<ContactFormModel | null> => {
    const parameters = new URLSearchParams([
      ["html_template", "template?name=thank_you"],
      ["subject", "Contact form submission - Portfolio"],
      ["to_field", "njmcloud@gmail.com"],
      ["from_name", "NjmTech NoReply"],
    ]);

    this.response_model = await this.get_sync_call(
      "Contact/GetContactTemplate",
      parameters,
    );

    return this.response_model.model;
  };

  public handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: this.config_service.getEmailUser,
        pass: this.config_service.getSecret,
      },
    });

    transporter.verify((error) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "Error connecting to email service" });
      } else {
        console.log("Ready to Send");
      }
    });

    const { firstName, lastName, email, message, phone } = req.body;

    const fullName =
      firstName && lastName ? `${firstName} ${lastName}` : "Unknown";

    const template_model: any = await this.getContactTemplate();

    const mailOptions = {
      from: `${fullName} <${email}>`,
      to: this.config_service.getSendAddress,
      subject: template_model.subject,
      html: template_model.body,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Error sending email" });
      } else {
        console.log("Email sent: " + info.response);
        return res
          .status(200)
          .json({ status: 200, message: "Email sent successfully" });
      }
    });
  };
}

export default new ContactService().handler;
