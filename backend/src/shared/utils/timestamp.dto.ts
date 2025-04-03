import { ApiProperty } from "@nestjs/swagger";

export class TimestampDto {

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2022-01-01T00:00:00.000Z'
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Update timestamp',
    example: '2022-01-01T00:00:00.000Z'
  })
  public updatedAt: Date;

}