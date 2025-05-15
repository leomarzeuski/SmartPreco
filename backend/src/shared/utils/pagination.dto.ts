import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PaginationReadDto {

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ description: 'Offset for pagination', example: 0 })
  public offset?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({ description: 'Limit for pagination', example: 10, default: 100 })
  public limit?: number = 100;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Field to order by', example: 'createdAt' })
  public orderBy?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Search term to filter results', example: 'market name, product name' })
  public search?: string;

}

export class PaginationResponseDto<T> {

  @IsArray()
  @ApiProperty({ description: 'List of records returned', isArray: true })
  public records: T[];

  @IsNumber()
  @ApiProperty({ description: 'Number of records in this page' })
  public count: number;

  @IsNumber()
  @ApiProperty({ description: 'Total number of records across all pages' })
  public total: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: 'Next offset for fetching the next page, null if no more records' })
  public nextOffset: number | null;

}