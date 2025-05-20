import { NOTIFICATION_STRATEGIES } from '@modules/notification/notification.const';
import { NotificationStrategy } from '@modules/notification/strategies/notification.strategy';
import { PriceComparatorService } from '@modules/price/price-comparator/price-comparator.service';
import { PriceTimestampDto } from '@modules/price/price.dto';
import { PriceService } from '@modules/price/price.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EventEnum } from '@shared/events/event.enum';
import { MainTag } from 'main.enum';
@Injectable()
export class PriceListener {

  private readonly logger = new Logger(MainTag.PRICE_LISTENER);

  public constructor(
    private readonly priceService: PriceService,
    private readonly priceComparatorService: PriceComparatorService,

    @Inject(NOTIFICATION_STRATEGIES)
    private readonly notificationStrategies: NotificationStrategy[],
  ) { }

  @OnEvent(EventEnum.REPORT_CREATED)
  public async handleReportCreated(priceId: string): Promise<void> {
    this.logger.verbose(`Processing REPORT_CREATED event for priceId: ${priceId}`);

    await this.priceService.updateModeratedFlag(priceId, false);
  }

  @OnEvent(EventEnum.REPORT_RESOLVED)
  public async handleReportResolved(priceId: string): Promise<void> {
    this.logger.verbose(`Processing REPORT_RESOLVED event for priceId: ${priceId}`);

    await this.priceService.updateModeratedFlag(priceId, true);
  }

  @OnEvent(EventEnum.PRICE_CREATED)
  public async handlePriceCreated(price: PriceTimestampDto): Promise<void> {
    const { id: priceId, product: { id: productId } } = price;

    try {
      this.logger.verbose(`Processing PRICE_CREATED event for priceId: ${priceId}`);

      const result = await this.priceComparatorService.analyzeNewPrice(priceId);

      if (!result.shouldNotify) return;

      for (const notificationStrategy of this.notificationStrategies) {
        await notificationStrategy.send({
          usersToNotify: result.usersToNotify,
          title: 'Novo desconto no app SmartPreço!',
          body: `O produto ${result.productName} está custando ${
            result.newPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          }. Aproveite!`,
          data: {
            screen: 'product-details',
            productId,
          },
        });
      }
    } catch (error) {
      this.logger.error(`Failed to process PRICE_CREATED for priceId ${priceId}`, error.stack);
    }
  }

}