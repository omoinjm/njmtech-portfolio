// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import nodemailer from 'nodemailer';

export default function handler(req: any, res: any) {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		port: 465,
		secure: true,
		auth: {
			user: process.env.NEXT_PUBLIC_EMAIL_USER,
			pass: process.env.NEXT_PUBLIC_EMAIL_APP_PASS,
		},
	});

	transporter.verify((error) => {
		if (error) {
			console.log(error);
		} else {
			console.log('Ready to Send');
		}
	});

	const name = req.body.firstName + req.body.lastName;
	const email = req.body.email;
	const message = req.body.message;
	const phone = req.body.phone;

	const mailOptions = {
		from: email,
		to: process.env.NEXT_PUBLIC_EMAIL_MAIL,
		subject: 'Contact form submission - Portfolio',
		text: message + ' | Sent from: ' + email,
		html: `<p><strong>Name: </strong> ${name} </p><br>
      <p><strong>Email: </strong> ${email} </p><br>
      <p><strong>Phone: </strong> ${phone} </p><br>
      <p><strong>Message: </strong> ${message} </p><br>
    `,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
			res.json('Error: ' + JSON.stringify(error));
		} else {
			console.log('Email sent: ' + info.response);
			res.json({ code: 200, status: 'Message Sent' });
		}
	});
}
