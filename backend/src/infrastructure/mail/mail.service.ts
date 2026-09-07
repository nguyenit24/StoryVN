import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
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

  async sendOtpEmail(email: string, otp: string, expiresInMinutes: number): Promise<void> {
    this.logger.log(`[MAIL] Mã OTP đăng ký cho ${email}: ${otp} (${expiresInMinutes} phút)`);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Mã xác thực đăng ký StoryVN</h2>
        <p style="color: #555; font-size: 16px;">Xin chào,</p>
        <p style="color: #555; font-size: 16px;">Bạn vừa yêu cầu đăng ký tài khoản trên nền tảng <strong>StoryVN</strong>. Dưới đây là mã xác thực OTP của bạn:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #4f46e5; background: #eef2ff; padding: 12px 24px; border-radius: 6px; border: 1px dashed #6366f1;">
            ${otp}
          </span>
        </div>
        <p style="color: #666; font-size: 14px;">Mã OTP này có hiệu lực trong vòng <strong>${expiresInMinutes} phút</strong>. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
      </div>
    `;

    try {
      await this.sendMail({
        to: email,
        subject: 'Mã xác thực đăng ký StoryVN',
        text: `Mã OTP xác thực tài khoản của bạn là: ${otp}. Mã này có hiệu lực trong ${expiresInMinutes} phút.`,
        html: htmlContent,
      });
    } catch (error: any) {
      this.logger.error(`Gửi email OTP thất bại tới ${email}: ${error?.message || error}`);
      throw new InternalServerErrorException(
        'Không thể gửi email xác thực. Vui lòng kiểm tra lại địa chỉ email hoặc thử lại sau.',
      );
    }
  }

  async sendForgotPasswordOtpEmail(email: string, otp: string, expiresInMinutes: number): Promise<void> {
    this.logger.log(`[MAIL] Mã OTP quên mật khẩu cho ${email}: ${otp} (${expiresInMinutes} phút)`);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #e11d48; text-align: center;">Yêu cầu đặt lại mật khẩu StoryVN</h2>
        <p style="color: #555; font-size: 16px;">Xin chào,</p>
        <p style="color: #555; font-size: 16px;">Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản <strong>${email}</strong> trên nền tảng <strong>StoryVN</strong>.</p>
        <p style="color: #555; font-size: 16px;">Dưới đây là mã OTP xác thực đặt lại mật khẩu:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #e11d48; background: #ffe4e6; padding: 12px 24px; border-radius: 6px; border: 1px dashed #f43f5e;">
            ${otp}
          </span>
        </div>
        <p style="color: #666; font-size: 14px;">Mã OTP này có hiệu lực trong vòng <strong>${expiresInMinutes} phút</strong>. Tuyệt đối không cung cấp mã này cho người khác để bảo vệ tài khoản.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">Nếu bạn không yêu cầu đặt lại mật khẩu, xin hãy bỏ qua email này hoặc liên hệ hỗ trợ nếu nghi ngờ bị xâm nhập.</p>
      </div>
    `;

    try {
      await this.sendMail({
        to: email,
        subject: 'Mã xác thực đặt lại mật khẩu StoryVN',
        text: `Mã OTP đặt lại mật khẩu của bạn là: ${otp}. Mã này có hiệu lực trong ${expiresInMinutes} phút.`,
        html: htmlContent,
      });
    } catch (error: any) {
      this.logger.error(`Gửi email OTP đặt lại mật khẩu thất bại tới ${email}: ${error?.message || error}`);
      throw new InternalServerErrorException(
        'Không thể gửi email xác thực đặt lại mật khẩu. Vui lòng thử lại sau.',
      );
    }
  }
}
