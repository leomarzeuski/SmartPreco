import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ProductCreateDto, ProductDto, ProductIdDto, ProductReadDto, ProductsDto, ProductUpdateDto } from './product.dto';
import { ProductService } from './product.service';

@Controller('products')
@ApiTags('Product')
export class ProductController { 
  public constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiCreatedResponse({ description: 'Product created successfully', type: ProductDto })
  @ApiOperation({
    operationId: "Create Product",
    summary: "Creates a new product."
  })
  public createProduct(@Body() body: ProductCreateDto): ProductDto {
    return this.productService.createProduct(body);
  }

  @Get()
  @ApiOkResponse({ description: 'Products retrieved successfully', type: ProductsDto })
  @ApiOperation({
    operationId: "Read Products",
    summary: "Retrieves a list of products."
  })
  public readProducts(@Query() query: ProductReadDto): ProductsDto {
    return this.productService.readProducts(query);
  }

  @Get(':productId')
  @ApiOkResponse({ description: 'Product retrieved successfully', type: ProductDto })
  @ApiOperation({
    operationId: "Read Product",
    summary: "Retrieves a product by its ID."
  })
  public readProductById(@Param() param: ProductIdDto) {
    const { productId: id } = param;

    return this.productService.readProductById(id);
  }

  @Patch(':productId')
  @ApiOkResponse({ description: 'Product updated successfully', type: ProductDto })
  @ApiOperation({
    operationId: "Update Product",
    summary: "Updates a product by its ID."
  })
  public updateProductById(@Param() param: ProductIdDto, @Body() body: ProductUpdateDto): ProductDto {
    const { productId: id } = param;

    return this.productService.updateProductById(id, body);
  }


  // TODO: Adicionar rota para listar preços do produto quando criar domínio de preços

}
