// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ContactFormModel, MessageLogModel } from "@/models";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const response_template: Promise<MessageLogModel | null> = handleRequest(req);

  console.log(response_template);

  //console.log(response_template)
  //const mailOptions = {
  //    from: `${response_template?.from_name} <${response_template?.to_field}>`,
  //    to: this.config_service.getSendAddress,
  //    subject: response_template?.subject,
  //    html: response_template?.body,
  //};
  //const transporter = nodemailer.createTransport({
  //    service: "gmail",
  //    auth: {
  //        user: this.config_service.getEmailUser,
  //        pass: this.config_service.getSecret,
  //    },
  //});
  //transporter.verify((error) => {
  //    if (error) {
  //        console.log(error);
  //        res.status(500).json({ error: "Error connecting to email service" });
  //    } else {
  //        console.log("Ready to Send");
  //    }
  //});
  //transporter.sendMail(mailOptions, (error, info) => {
  //    if (error) {
  //        console.log(error);
  //        return res.status(500).json({ error: "Error sending email" });
  //    } else {
  //        console.log("Email sent: " + info.response);
  //        return res
  //            .status(200)
  //            .json({ status: 200, message: "Email sent successfully" });
  //    }
  //});
  // };


}

const handleRequest = async (
  req: NextApiRequest,
): Promise<MessageLogModel | null> => {
  const { first_name, last_name, email_address, message, phone } = req.body;

  const reqItem: ContactFormModel = {
    email_address: email_address,
    first_name: first_name,
    last_name: last_name,
  };

  return await getContactTemplate(reqItem);
};

const getContactTemplate = async (
  req: ContactFormModel,
): Promise<MessageLogModel | null> => {
  //   const parameters = new URLSearchParams([
  //     [
  //       "html_template",
  //       `template_name=thank_you&first_name=${req.first_name}&last_name=${req.last_name}`,
  //     ],
  //     ["subject", "Contact form submission - Portfolio"],
  //     ["email_address", req.email_address],
  //     ["first_name", req.first_name],
  //     ["last_name", req.last_name],
  //   ]);

  //   this.response_model = await this.get_sync_call(
  //     "Contact/GetContactTemplate",
  //     parameters,
  //   );

  //   return !this.response_model.is_error ? this.response_model.model : null;
  // };
  return null;
}

export default handler;
