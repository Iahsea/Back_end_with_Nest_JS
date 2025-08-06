import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService
  ) { }

  @Get()
  @Public()
  @ResponseMessage("Test email")
  async handleTestEmail() {
    await this.mailerService.sendMail({
      to: "ngyenchinhhai@gmail.com",
      from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: "job",
      context: {
        username: 'Nguyễn Văn A', // Truyền đúng tên biến như trong template
        appName: 'Nice App',
        confirmUrl: `https://yourapp.com/verify?email`,
        year: new Date().getFullYear()
      }
    });
  }

}

