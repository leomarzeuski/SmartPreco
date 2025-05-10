import { Module } from '@nestjs/common';

import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { UploadStrategyFactory } from './upload.strategy.factory';
import { S3UploadStrategy } from './upload-s3.strategy';
import { SupabaseUploadStrategy } from './upload-supabase.strategy';

@Module({
  controllers: [ UploadController ],
  providers: [
    UploadService,
    SupabaseUploadStrategy,
    S3UploadStrategy,
    UploadStrategyFactory,
    {
      provide: 'UploadStrategy',
      useFactory: (uploadStrategyFactory: UploadStrategyFactory) => {
        return uploadStrategyFactory.create();
      },
      inject: [ UploadStrategyFactory ],
    },
  ],
})
export class UploadModule {}
