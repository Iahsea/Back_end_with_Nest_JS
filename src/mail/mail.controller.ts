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
        username: 'Nguyễn Văn A',
        appName: 'Recruitment Pro',
        position: 'Backend Developer',
        feedback: 'CV của bạn rất tốt, tuy nhiên chúng tôi cần thêm minh chứng về kinh nghiệm phát triển API với NestJS và MongoDB.',
        viewCvUrl: 'https://yourapp.com/cv/view/12345',
        year: new Date().getFullYear()
      }
    });
  }

}

