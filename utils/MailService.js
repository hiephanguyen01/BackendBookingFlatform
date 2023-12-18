const nodemailer = require("nodemailer");
const { MailService: ModelMail } = require("../models");
class MailSevice {
  transporter;
  static async init() {
    try {
      let data = await ModelMail.findOne({
        where: {
          isActivate: true,
        },
      });
      const mail = data.dataValues;
      this.transporter = nodemailer.createTransport({
        host: mail.host,
        service: mail.service,
        port: mail.port,
        secure: true,
        auth: {
          user: mail.user,
          pass: mail.pass,
        },
      });
    } catch (error) {
      console.log("🚀 ~ MailSevice ~ init ~ error:", error);
    }
  }
  static async sendMail(to, subject, text, html) {
    await this.transporter.sendMail({ to, subject, text, html });
  }
}

module.exports = MailSevice;
