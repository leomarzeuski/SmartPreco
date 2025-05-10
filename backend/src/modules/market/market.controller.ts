import { MarketDto, MarketCreateDto, MarketsDto, MarketReadDto, MarketIdDto, MarketUpdateDto } from "@modules/market/market.dto";
import { MarketService } from "@modules/market/market.service";
import { Controller, Post, HttpCode, HttpStatus, Body, Get, Query, Param, Patch, Delete } from "@nestjs/common";
import { ApiTags, ApiCreatedResponse, ApiOperation, ApiOkResponse, ApiNoContentResponse } from "@nestjs/swagger";
import { UseUser } from "@shared/guards/use-user.decorator";

@Controller('markets')
@ApiTags('Market')
@UseUser()
export class MarketController {

  public constructor(private readonly marketService: MarketService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Market created successfully', type: MarketDto })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    operationId: 'Create Market',
    summary: 'Creates a new market.',
  })
  public createMarket(@Body() body: MarketCreateDto): Promise<MarketDto> {
    return this.marketService.createMarket(body);
  }

  @Get()
  @ApiOkResponse({ description: 'Markets retrieved successfully', type: MarketsDto })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'Read Markets',
    summary: 'Retrieves a list of markets.',
  })
  public readMarkets(@Query() query: MarketReadDto): Promise<MarketsDto> {
    return this.marketService.readMarkets(query);
  }

  @Get(':marketId')
  @ApiOkResponse({ description: 'Market retrieved successfully', type: MarketDto })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'Read Market',
    summary: 'Retrieves a market by its ID.',
  })
  public readMarketById(@Param() param: MarketIdDto): Promise<MarketDto> {
    const { marketId } = param;

    return this.marketService.readMarketById(marketId);
  }

  @Patch(':marketId')
  @ApiOkResponse({ description: 'Market updated successfully', type: MarketDto })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'Update Market',
    summary: 'Updates a market by its ID.',
  })
  public updateMarketById(@Param() param: MarketIdDto, @Body() body: MarketUpdateDto): Promise<MarketDto> {
    const { marketId } = param;

    return this.marketService.updateMarketById(marketId, body);
  }

  @Delete(':marketId')
  @ApiNoContentResponse({ description: 'Market deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    operationId: 'Delete Market',
    summary: 'Deletes a market by its ID.',
  })
  public deleteMarketById(@Param() param: MarketIdDto): Promise<void> {
    const { marketId } = param;

    return this.marketService.deleteMarketById(marketId);
  }
}