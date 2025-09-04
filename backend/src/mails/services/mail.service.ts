import nodemailer from "nodemailer";
import {
  MailConfigurations,
  MessageOptions,
} from "../../interfaces/utils/mail";

const createTransporter = (config: MailConfigurations) => {
  return nodemailer.createTransport(config);
};

const mailConfig: MailConfigurations = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  requireTLS: true,
  auth: {
    user: process.env.USER_MAIL as string,
    pass: process.env.PASSWORD as string,
  },
};

export const sendMail = async (messageOptions: MessageOptions) => {
  const transtporter = createTransporter(mailConfig);

  await transtporter.verify();

  transtporter.sendMail(messageOptions, (err, info) => {
    if (err) console.log(err.message);
    else console.log(info.response);
  });
};
