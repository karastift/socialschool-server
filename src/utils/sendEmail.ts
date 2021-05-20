import nodemailer from "nodemailer";

export async function sendEmail(to: string, html: string) {

//   let testAccount = await nodemailer.createTestAccount();
//   console.log('testAcc:', testAccount);

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'zij4kzxriishueze@ethereal.email',
      pass: 'Df46PvxZtfcmJANEv1',
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: to,
    subject: "Change password",
    html,
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}