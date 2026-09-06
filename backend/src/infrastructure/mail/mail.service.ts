import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter, type SendMailOptions, type SentMessageInfo } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter;
  private readonly defaultFrom?: string;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('MAIL_HOST');
    const port = Number(this.configService.get<number>('MAIL_PORT') ?? 587);
    const user = this.configService.get<string>('MAIL_USER');
    const pass = this.configService.get<string>('MAIL_PASSWORD');

    this.defaultFrom = this.configService.get<string>('MAIL_FROM');

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
    });

    this.logger.log('Mail service initialized');
  }

  getTransporter(): Transporter {
    return this.transporter;
  }

  async sendMail(options: SendMailOptions): Promise<SentMessageInfo> {
    const mailOptions: SendMailOptions = {
      from: options.from || this.defaultFrom,
      ...options,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
