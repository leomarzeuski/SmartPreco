/* eslint-disable import/namespace */
import { NotificationParams } from '@modules/notification/notification.interface';
import { NotificationStrategy } from '@modules/notification/strategies/notification.strategy';
import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { buildEmailHtml } from '@shared/utils/email-builder';
import { MainTag } from 'main.enum';

@Injectable()
export class SendGridEmailNotificationStrategy implements NotificationStrategy {

  private readonly logger = new Logger(MainTag.SENDGRID_NOTIFICATION);

  public constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      this.logger.error('SENDGRID_API_KEY is not set in environment variables.');
      throw new Error('SENDGRID_API_KEY is not set');
    }
    sgMail.setApiKey(apiKey);
  }

  public async send(params: NotificationParams): Promise<void> {
    const { usersToNotify, title, body, data } = params;

    const emails = usersToNotify
      .map(({ email }) => email)
      .filter((email): email is string => !!email);

    if (emails.length === 0) {
      this.logger.warn('No valid email addresses found for notification.');
      return;
    }

    const messages = emails.map(email => ({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: title,
      text: body,
      html: buildEmailHtml(body),
    }));

    try {
      await sgMail.send(messages, false);
      this.logger.verbose(`Emails sent to: ${emails.join(', ')}`);
    } catch (error) {
      this.logger.error(`Failed to send emails via SendGrid: ${error.message}`, error.stack);
    }
  }
}