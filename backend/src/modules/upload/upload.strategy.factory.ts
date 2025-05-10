import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MainTag } from 'main.enum';
import { S3UploadStrategy } from './upload-s3.strategy';
import { SupabaseUploadStrategy } from './upload-supabase.strategy';
import { UploadStrategy } from './upload.strategy';

@Injectable()
export class UploadStrategyFactory {

  private readonly logger = new Logger(MainTag.UPLOAD);

  public constructor(private readonly configService: ConfigService) {}

  public create(): UploadStrategy {
    const driver = this.configService.get<string>('UPLOAD_DRIVER')?.toLowerCase();

    this.logger.debug(`Upload configured with ${driver.toUpperCase()}! 🚀`);

    switch (driver) {
      case 's3':
        return new S3UploadStrategy(this.configService);
      case 'supabase':
        return new SupabaseUploadStrategy(this.configService);
      default:
        throw new Error(`Unknown upload driver: ${driver}`);
    }
  }

}