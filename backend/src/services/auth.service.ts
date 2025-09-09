import { PrismaClient } from "@prisma/client";
import { IAuthService } from "../interfaces/abstracts/services.abstracts";
import { LoginDetails, ChangePasswoerdDto } from "../interfaces/backend.interfaces";
import { ServiceResult } from "../interfaces/service.result/service.result";
import { v4 } from "uuid";
import bcrypt from "bcrypt";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { TokenDetails } from "../interfaces/utils/token.details";
import jwt from "jsonwebtoken";
import ejs, { name } from "ejs";
import path from "path";
import { sendMail } from "../mails/services/mail.service";
import { MessageOptions } from "../interfaces/utils/mail";

export class AuthService implements IAuthService {
  private prisma = new PrismaClient({
    log: ["error"],
  });

  async loginUser(loginDetails: LoginDetails): Promise<ServiceResult<object>> {
    
    let UserExists = await this.prisma.user.findUnique({
      where: {
        Email: loginDetails.Email
      }
    });

    if (UserExists == null) return ServiceResponse.failure<object>(ErrorCode.NOTFOUND, "email provided not found, kindly register an account.");

    let PasswordMatch: boolean = bcrypt.compareSync(loginDetails.Password, UserExists.Password);

    if (!PasswordMatch) return ServiceResponse.failure<object>(ErrorCode.UNAUTHORIZED, "password provided is incorrect.");

    let tokenDetails: TokenDetails = {
      UserId: UserExists.UserId,
      Email: UserExists.Email,
      Role: UserExists.Role
    }

    let token: string = jwt.sign(tokenDetails, process.env.SECRET_KEY as string, { expiresIn: '45m' });

    return ServiceResponse.auth<object>(token);
  }
  async verifyMail(Email: string): Promise<ServiceResult<object>> {
    
    let UserExists = await this.prisma.user.findUnique({
      where: {
        Email: Email
      }
    });

    if (UserExists == null) return ServiceResponse.failure<object>(ErrorCode.NOTFOUND, "email provided not found, kindly register an account.");

    let CreateRecovery = await this.prisma.recovery.create({
      data: {
        RecoveryId: v4(),
        UserId: UserExists.UserId,
        VerificationCode: Math.floor(100000 + Math.random() * 900000),
        ExpiresAt: new Date(new Date().getTime() + 15 * 60000),
        IsUsed: false
      }
    });

    if (!CreateRecovery) return ServiceResponse.failure<object>(ErrorCode.SERVER, "unable to process request at the moment, try again later.");

    ejs.renderFile(path.join(__dirname, "..", "..", "emails", "verification.code.mail.ejs"), { name: UserExists.FullName, code: CreateRecovery.VerificationCode }, async (err, data) => {
      if (err) console.log(err.message);

      else {
        let messageOptions: MessageOptions = {
          from: process.env.USER_MAIL as string,
          to: UserExists.Email,
          subject: "Password Recovery Code",
          html: data
        }

        await sendMail(messageOptions);
      }
    });

    return ServiceResponse.success<object>("verification code sent to your mail successfully, it expires in 15 minutes.");
  }
  async changePassword(details: ChangePasswoerdDto): Promise<ServiceResult<object>> {
    
    let UserExists = await this.prisma.user.findUnique({
      where: {
        Email: details.Email
      }
    });

    if (UserExists == null) return ServiceResponse.failure<object>(ErrorCode.NOTFOUND, "email provided not found, kindly register an account.");

    let RecoveryExists = await this.prisma.recovery.findFirst({
      where: {
        UserId: UserExists.UserId,
        VerificationCode: details.VerificationCode,
        IsUsed: false,
        ExpiresAt: {
          gt: new Date()
        }
      }
    });

    if (RecoveryExists == null) return ServiceResponse.failure<object>(ErrorCode.NOTFOUND, "invalid or expired verification code provided.");

    let UpdatePassword = await this.prisma.user.update({
      where: {
        UserId: UserExists.UserId
      },
      data: {
        Password: bcrypt.hashSync(details.NewPassword, 10)
      }
    });

    if (!UpdatePassword) return ServiceResponse.failure<object>(ErrorCode.SERVER, "unable to change password at the moment, try again later.");

    await this.prisma.recovery.update({
      where: {
        RecoveryId: RecoveryExists.RecoveryId
      },
      data: {
        IsUsed: true
      }
    });

    return ServiceResponse.success<object>("password changed successfully, you can now login with your new password.");
  }
  logput(): void {
    throw new Error("Method not implemented.");
  }
}