import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MainTag } from '../../main.enum';
import { S3UploadStrategy } from './upload-s3.strategy';
import { SupabaseUploadStrategy } from './upload-supabase.strategy';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  controllers: [ UploadController ],
  providers: [
    UploadService,
    SupabaseUploadStrategy,
    S3UploadStrategy,
    {
      provide: 'UploadStrategy',
      useFactory: (config: ConfigService) => {
        const driver = config.get<string>('UPLOAD_DRIVER');
        const logger = new Logger(MainTag.UPLOAD);

        logger.debug(`Upload configured with ${driver.toUpperCase()}! 🚀`);

        return driver === 's3'
          ? new S3UploadStrategy(config)
          : new SupabaseUploadStrategy(config);
      },
      inject: [ ConfigService ],
    },
  ],
})
export class UploadModule {}
