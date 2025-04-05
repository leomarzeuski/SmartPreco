import { Body, Controller, Get, NotImplementedException, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PriceCreateDto, PriceDto, PriceReadDto, PricesDto } from './price.dto';
import { PriceService } from './price.service';

@Controller('prices')
@ApiTags('Price')
export class PriceController {

  public constructor(private readonly priceService: PriceService) { }

  @Post()
  @ApiCreatedResponse({ description: 'Price created successfully', type: PriceDto })
  @ApiOperation({
    operationId: "Create Price",
    summary: "Create a new price",
  })
  public createPrice(@Body() body: PriceCreateDto): PriceDto {
    throw new NotImplementedException("Not implemented yet.");
  }

  @Get()
  @ApiOkResponse({ description: 'Prices retrieved successfully', type: PricesDto })
  @ApiOperation({
    operationId: "Read Prices",
    summary: "Read all prices",
  })
  public readPrices(@Query() query: PriceReadDto): PricesDto {
    throw new NotImplementedException("Not implemented yet.");
  }


}
