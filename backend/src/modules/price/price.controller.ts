import { PriceCreateDto, PriceDto, PriceReadDto, PricesDto } from '@modules/price/price.dto';
import { PriceService } from '@modules/price/price.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseUser } from '@shared/guards/use-user.decorator';
@Controller('prices')
@ApiTags('Price')
@UseUser()
export class PriceController {

  public constructor(private readonly priceService: PriceService) { }

  @Post()
  @ApiCreatedResponse({ description: 'Price created successfully', type: PriceDto })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    operationId: "Create Price",
    summary: "Create a new price",
  })
  public createPrice(@Body() body: PriceCreateDto): Promise<PriceDto> {
    return this.priceService.createPrice(body);
  }

  @Get()
  @ApiOkResponse({ description: 'Prices retrieved successfully', type: PricesDto })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: "Read Prices",
    summary: "Read all prices",
  })
  public readPrices(@Query() query: PriceReadDto): Promise<PricesDto> {
    return this.priceService.readPrices(query);
  }


}
