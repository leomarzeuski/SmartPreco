import { FavoriteModule } from '@modules/favorite/favorite.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { DiscordNotificationStrategy } from '@modules/notification/strategies/discord-notification.strategy';
import { ExpoPushNotificationStrategy } from '@modules/notification/strategies/expo-push-notification.strategy';
import { SendGridEmailNotificationStrategy } from '@modules/notification/strategies/send-grid-notification.strategy';
import { PriceComparatorService } from '@modules/price/price-comparator/price-comparator.service';
import { PriceController } from '@modules/price/price.controller';
import { PriceListener } from '@modules/price/price.listener';
import { PriceRepository } from '@modules/price/price.repository';
import { PriceService } from '@modules/price/price.service';
import { forwardRef, Module } from '@nestjs/common';
import { ClerkModule } from '@shared/clerk/clerk.module';

@Module({
  imports: [
    forwardRef(() => FavoriteModule),
    ClerkModule,
    NotificationModule.register([
      ExpoPushNotificationStrategy,
      DiscordNotificationStrategy,
      SendGridEmailNotificationStrategy,
    ]),
   ],
  controllers: [ PriceController ],
  providers: [ PriceService, PriceRepository, PriceListener, PriceComparatorService ],
  exports: [ PriceService, PriceRepository, PriceComparatorService ],
})
export class PriceModule {}
