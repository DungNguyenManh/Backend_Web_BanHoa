import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // Đặt biến này trong .env nếu dùng Gmail
      },
    });
  }

  async sendMail({ to, subject, text, code }: {
    to: string;
    subject: string;
    text?: string;
    code?: string;
  }) {
    // Override email nhận nếu có MAIL_DEFAULT_TO
    const realTo = process.env.MAIL_DEFAULT_TO || to;
    const mailText = text || `Mã xác nhận của bạn là: ${code}`;
    await this.transporter.sendMail({
      from: process.env.MAIL_USER,
      to: realTo,
      subject,
      text: mailText,
    });
  }
}
