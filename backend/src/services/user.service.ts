import { PrismaClient, User } from "@prisma/client";
import { IUserService } from "../interfaces/abstracts/services.abstracts";
import { CreateUserDto, UpdateUserDto } from "../interfaces/dtos/interfaces.dtos";
import { ServiceResult } from "../interfaces/service.result/service.result";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { v4 } from "uuid";
import bcrypt from "bcrypt";

export class UserService implements IUserService {

  private prisma = new PrismaClient({
    log: ["error"]
  });

  async CreateUser(User: CreateUserDto): Promise<ServiceResult<User>> {

    let EmailExists = await this.prisma.user.findUnique({
      where: {
        Email: User.Email
      }
    });

    if (EmailExists) return ServiceResponse.failure<User>(ErrorCode.DUPLICATE, "email provided exists");

    let PhoneExists = await this.prisma.user.findUnique({
      where: {
        Phone: User.Phone
      }
    });

    if (PhoneExists) return ServiceResponse.failure<User>(ErrorCode.DUPLICATE, "phone number provided exists");

    let CreateUser = await this.prisma.user.create({
      data: {
        UserId: v4(),
        ...User,
        Password: bcrypt.hashSync(User.Password, 10)
      }
    });

    if (!CreateUser) return ServiceResponse.failure<User>(ErrorCode.SERVER, "unable to create user");

    return ServiceResponse.success<User>("registration successful");
  }
  async UpdateUser(UserId: string, user: UpdateUserDto): Promise<ServiceResult<User>> {
    
    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if(UserExists == null) return ServiceResponse.failure<User>(ErrorCode.NOTFOUND, "your details are unavailable at the moment.");

    let UpdateUser = await this.prisma.user.update({
      where: {
        UserId
      },
      data: {
        ...user
      }
    });

    if(UpdateUser == null) return ServiceResponse.failure<User>(ErrorCode.SERVER, "unable to update details at the moment.");

    return ServiceResponse.success<User>("profile updated successfully.");

  }
  async UpdateUserProfileImage(UserId: string, ProfileImage: string): Promise<ServiceResult<User>> {
    
    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (UserExists == null) return ServiceResponse.failure<User>(ErrorCode.NOTFOUND, "your details are unavailable at the monent.");

    let UpdateProfile = await this.prisma.user.update({
      where: {
        UserId
      },
      data: {
        ProfileImage
      }
    });

    if (UpdateProfile == null) return ServiceResponse.failure<User>(ErrorCode.SERVER, "unable to update profile image at the moment.");

    return ServiceResponse.success<User>("profile image updated successfully.");

  }
  async DeleteUser(UserId: string): Promise<ServiceResult<User>> {
    
    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (UserExists == null) return ServiceResponse.failure<User>(ErrorCode.NOTFOUND, "your details are unavailable at the moment.");

    let DeleteUser = await this.prisma.user.delete({
      where: {
        UserId
      }
    });

    if (DeleteUser == null) return ServiceResponse.failure<User>(ErrorCode.SERVER, "unable to delete user at the moment.");

    return ServiceResponse.success<User>("user deleted successfully.");
  }
  async GetUserByUserId(UserId: string): Promise<ServiceResult<User>> {
    
    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      },
      include: {
        Bookings: true,
        Accommodations: true,
        Orders: true,
        Recoveries: true,
        Payments: true,
        Reviews: true,
        Carts: true,
        Notifications: true
      }
    });

    if (UserExists == null) return ServiceResponse.failure<User>(ErrorCode.NOTFOUND, "your details are unavailable at the moment.");

    return ServiceResponse.success<User>("user details retrieved successfully.", UserExists);
  }
  async GetAllUsers(): Promise<ServiceResult<User>> {
    
    let Users = await this.prisma.user.findMany({
      where: {
        Role: {
          not: "admin"
        }
      },
      orderBy: {
        CreatedAt: 'desc'
      },
      include: {
        Bookings: true,
        Accommodations: true,
        Orders: true,
        Recoveries: true,
        Payments: true,
        Reviews: true
      }
    });

    if (Users == null) return ServiceResponse.failure<User>(ErrorCode.NOTFOUND, "no users available at the moment.");

    return ServiceResponse.success<User>("users retrieved successfully.", undefined, Users);
  }
  
}