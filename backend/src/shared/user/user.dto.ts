import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class UserDto {

  public author: AuthorDto;

}

export class AuthorDto {

  @ApiProperty({
    description: 'User first name',
    example: 'Felipe'
  })
  public firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Mariano'
  })
  public lastName: string;

  @ApiProperty({
    description: 'User profile image url',
    example: 'felipe@example.com'
  })
  public imageUrl: string;

}

export class UserIdDto {

  @IsUUID()
  @ApiProperty({
    description: 'User unique identifier',
    example: '3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d'
  })
  public userId: string;

}

export class UserIdRepositoryDto {

  @IsUUID()
  @ApiProperty({
    description: 'User unique identifier',
    example: '3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d'
  })
  public user_id: string;

}