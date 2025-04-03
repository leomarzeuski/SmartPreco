import { ApiProperty } from "@nestjs/swagger";

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