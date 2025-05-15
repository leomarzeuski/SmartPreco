import { ProductCreateDto, ProductDto, ProductIdDto, ProductReadDto, ProductsDto, ProductsMergeDto, ProductUpdateDto } from '@modules/product/product.dto';
import { ProductService } from '@modules/product/product.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseAdmin } from '@shared/guards/use-admin.decorator';
import { UseUser } from '@shared/guards/use-user.decorator';
@Controller('products')
@ApiTags('Product')
@UseUser()
export class ProductController {

  public constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiCreatedResponse({ description: 'Product created successfully', type: ProductDto })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    operationId: "Create Product",
    summary: "Creates a new product."
  })
  public createProduct(@Body() body: ProductCreateDto): Promise<ProductDto> {
    return this.productService.createProduct(body);
  }

  @Get()
  @ApiOkResponse({ description: 'Products retrieved successfully', type: ProductsDto })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: "Read Products",
    summary: "Retrieves a list of products."
  })
  public readProducts(@Query() query: ProductReadDto): Promise<ProductsDto> {
    return this.productService.readProducts(query);
  }

  @Get(':productId')
  @ApiOkResponse({ description: 'Product retrieved successfully', type: ProductDto })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: "Read Product",
    summary: "Retrieves a product by its ID."
  })
  public readProductById(@Param() param: ProductIdDto) {
    const { productId } = param;

    return this.productService.readProductById(productId);
  }

  @Patch('merge')
  @ApiOkResponse({ description: 'Products merged successfully' })
  @ApiOperation({
    operationId: "Merge Products",
    summary: "Merge duplicate products into a target product",
  })
  @UseAdmin()
  public mergeProducts(@Body() body: ProductsMergeDto): Promise<void> {
    return this.productService.mergeProducts(body);
  }

  @Patch(':productId')
  @ApiOkResponse({ description: 'Product updated successfully', type: ProductDto })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: "Update Product",
    summary: "Updates a product by its ID."
  })
  public updateProductById(@Param() param: ProductIdDto, @Body() body: ProductUpdateDto): Promise<ProductDto> {
    const { productId } = param;

    return this.productService.updateProductById(productId, body);
  }

  @Delete(':productId')
  @ApiNoContentResponse({ description: 'Product deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    operationId: "Delete Product",
    summary: "Deletes a product by its ID."
  })
  public deleteProductById(@Param() param: ProductIdDto): Promise<void> {
    const { productId } = param;

    return this.productService.deleteProductById(productId);
  }

}
