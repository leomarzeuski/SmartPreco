import { ApiProperty } from "@nestjs/swagger";
import { IsUrl } from "class-validator";

export class UploadCreateDto {

  @ApiProperty({ description: 'Image file', type: 'string', format: 'binary' })
  public file: Buffer;

}

export class UploadImageDto {

  @IsUrl()
  @ApiProperty({
    description: "Product's image URL",
    example: "https://example.com/image.jpg",
  })
  public imageUrl: string;

}

export class UploadImageRepositoryDto {

  @IsUrl()
  @ApiProperty({
    description: "Product's image URL",
    example: "https://example.com/image.jpg",
  })
  // eslint-disable-next-line camelcase
  public image_url: string;

}

