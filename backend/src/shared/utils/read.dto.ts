import { IsOptional, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ReadDto {

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "Search term to filter the results",
    example: "Rice",
  })
  public search?: string;

}