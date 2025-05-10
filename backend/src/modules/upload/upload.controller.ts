import { UploadImageDto } from "@modules/upload/upload.dto";
import { UploadService } from "@modules/upload/upload.service";
import { Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller('upload')
@ApiTags('Upload')
export class UploadController {

  public constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', {  limits: { fileSize: 50 * 1024 * 1024 }  }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Uploads an image and returns the public URL' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  public async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<UploadImageDto> {
    return this.uploadService.uploadImage(file);
  }

}