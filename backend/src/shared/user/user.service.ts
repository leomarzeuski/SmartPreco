import { clerkClient } from "@clerk/clerk-sdk-node";
import { Injectable } from "@nestjs/common";

import { ContextEnum } from "../../shared/context/context.enum";
import { ContextService } from "../../shared/context/context.service";


@Injectable()
export class UserService {
  public constructor(private readonly contextService: ContextService) {}

  // public async getUserDetails(userId: string): Promise<UserDto> {

  //   return {
  //     author: {
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       imageUrl: user.imageUrl,
  //     },
  //   };
  // }
}
