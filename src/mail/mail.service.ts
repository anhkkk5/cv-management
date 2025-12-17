import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { createEvent } from 'ics';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter | null;
  private readonly from: string;

  constructor() {
    const host = process.env.SMTP_HOST;
    const portStr = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    this.from = process.env.MAIL_FROM || user || 'no-reply@example.com';

    if (!host || !portStr || !user || !pass) {
      this.logger.warn(
        'SMTP is not configured (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS). Emails will not be sent.',
      );
      this.transporter = null;
      return;
    }

    const port = parseInt(portStr, 10);
    const effectivePort = Number.isNaN(port) ? 587 : port;

    this.transporter = nodemailer.createTransport({
      host,
      port: effectivePort,
      secure: effectivePort === 465,
      auth: { user, pass },
    });
  }

  buildInterviewIcs(params: {
    title: string;
    description: string;
    location?: string;
    start: Date;
    durationMinutes?: number;
    url?: string;
  }): { filename: string; content: string } {
    const d = params.start;
    const durationMinutes = params.durationMinutes ?? 30;

    const event: Parameters<typeof createEvent>[0] = {
      title: params.title,
      description: params.description,
      location: params.location,
      start: [
        d.getFullYear(),
        d.getMonth() + 1,
        d.getDate(),
        d.getHours(),
        d.getMinutes(),
      ],
      duration: { minutes: durationMinutes },
      status: 'CONFIRMED',
      productId: 'cv-management-api',
    };

    if (params.url) {
      event.url = params.url;
    }

    const result = createEvent(event);
    if (result.error) {
      throw result.error;
    }
    if (!result.value) {
      throw new Error('Failed to generate .ics content');
    }

    return { filename: 'interview.ics', content: result.value };
  }

  async sendMail(params: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    ics?: { filename: string; content: string };
  }) {
    if (!this.transporter) {
      this.logger.warn(`Skip sending email to ${params.to}: transporter not configured`);
      return;
    }

    const attachments = params.ics
      ? [
          {
            filename: params.ics.filename,
            content: params.ics.content,
            contentType: 'text/calendar; charset=utf-8',
          },
        ]
      : [];

    await this.transporter.sendMail({
      from: this.from,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
      attachments,
    });
  }
}
