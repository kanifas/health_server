const nodemailer = require('nodemailer');

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
    });
  }

  async sendConfirmationMail(email, confirmationLink) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'JWT / Активация аккаунта',
      text: '',
      html: `
        <div>
          <h2 style="color: #fff; text-align: center; background: #5c95c6; text-transform: uppercase; padding: 10px 0">
            Для активации аккаунта перейдите по ссылке
          </h2>
          <br/>
          <a href="${confirmationLink}">${confirmationLink}</a>
          <br/><br/><br/><br/><br/>
          <h6 style="color: #fff; text-align: center; background:#333; text-transform: uppercase; padding: 10px">
            Если это были не вы, просто проигнорируйте это письмо
          </h6>
        </div>
      `
    });
  }
}

module.exports = new MailService()