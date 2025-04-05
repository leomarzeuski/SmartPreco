import { Body, Controller, NotImplementedException, Post } from '@nestjs/common';
import { ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UploadCreateDto, UploadImageDto } from './upload.dto';

@Controller('upload')
@ApiTags('Upload')
export class UploadController {

  @Post()
  @ApiCreatedResponse({ description: 'Image uploaded successfully', type: UploadImageDto })
  @ApiConsumes("multipart/form-data")
  @ApiOperation({
    operationId: "Upload Image",
    summary: "Uploads an image."
  })
  public uploadImage(@Body() body: UploadCreateDto): UploadImageDto {
    throw new NotImplementedException("Not implemented yet");
  }

}
