import { Body, Controller, Get, NotImplementedException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { MarketCreateDto, MarketDto, MarketIdDto, MarketReadDto, MarketsDto, MarketUpdateDto } from './market.dto';
import { MarketService } from './market.service';

@Controller('markets')
@ApiTags('Market')
export class MarketController {

   public constructor(private readonly marketService: MarketService) { }

   @Post()
   @ApiCreatedResponse({ description: 'Market created successfully', type: MarketDto })
   @ApiOperation({
      operationId: "Create Market",
      summary: "Creates a new market."
   })

   public createMarket(@Body() body: MarketCreateDto): MarketDto {
      throw new NotImplementedException("Not implemented yet.");
   }

   @Get()
   @ApiOkResponse({ description: 'Market retrieved successfully', type: MarketsDto })
   @ApiOperation({
      operationId: "Read Markets",
      summary: "Retrieves a list of markets."
   })
   public readMarkets(@Query() query: MarketReadDto): MarketsDto {
      throw new NotImplementedException("Not implemented yet.");
   }

   @Get(':marketId')
   @ApiOkResponse({ description: 'Market retrieved successfully', type: MarketDto })
   @ApiOperation({
      operationId: "Read Market",
      summary: "Retrieves a market by its ID."
   })
   public readMarketById(@Param() param: MarketIdDto): MarketDto {
      const { marketId } = param;

      throw new NotImplementedException("Not implemented yet.");
   }

   @Patch(':marketId')
   @ApiOkResponse({ description: 'Market updated successfully', type: MarketDto })
   @ApiOperation({
      operationId: "Update Market",
      summary: "Updates a market by its ID."
   })
   public updateMarketById(@Param() param: MarketIdDto, @Body() body: MarketUpdateDto): MarketDto {
      const { marketId } = param;

      throw new NotImplementedException("Not implemented yet.");
   }

}
