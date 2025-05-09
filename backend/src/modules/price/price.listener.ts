import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EventEnum } from '../../shared/events/event.enum';
import { PriceService } from './price.service';

@Injectable()
export class PriceListener {

  public constructor(private readonly priceService: PriceService) {}

  @OnEvent(EventEnum.REPORT_CREATED)
  public async handleReportCreated(priceId: string): Promise<void> {
    await this.priceService.updateModeratedFlag(priceId, false);
  }

  @OnEvent(EventEnum.REPORT_RESOLVED)
  public async handleReportResolved(priceId: string): Promise<void> {
    await this.priceService.updateModeratedFlag(priceId, true);
  }

}