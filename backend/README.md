# SmartPreço · Backend API

API em NestJS que abastece o app **SmartPreço**, comparando valores de produtos em tempo real, gerenciando favoritos, notificações multicanal e uploads de imagens.

## Sumário
1. [Tech Stack](#tech-stack)  
2. [Execução local](#execução-local)  
3. [Estrutura do projeto](#estrutura-do-projeto)  
4. [Princípios SOLID & Padrões de Projeto](#princípios-solid--padrões-de-projeto)  
5. [Contribuição](#contribuição)  
6. [Licença](#licença)  

---

## Tech Stack
- **Node 18 + pnpm**  
- **NestJS 10** (modular & DI)  
- **PostgreSQL**  
- **AWS S3 / Supabase Storage** (Strategy)  
- **SendGrid, Expo, Discord webhook** (Notification strategies)  
- **Jest** + **Supertest** (100 % unit-level)

---

## Execução local

```bash
# 1. variáveis de ambiente
cp .env.schema .env        # edite conforme seu setup

# 2. dependências
pnpm i

# 3. ambiente de desenvolvimento
pnpm dev
````

Testes:

```bash
pnpm test
```

---

## Estrutura do projeto

```text
src/
├── modules/         # contexto de negócio por domínio
│   ├── favorite/    # favoritar mercados & produtos
│   ├── notification/│ envio multi-canal (Strategy)
│   ├── price/       # preços + observador de eventos
│   └── upload/      # upload + Strategy factory
├── shared/          # infraestrutura reusável
└── main.ts          # bootstrap Nest
```

---

## Princípios SOLID & Padrões de Projeto

> Cada seção traz um *mini-trecho real* do código (🚀 = caminho no repositório) para ilustrar o princípio.

### S — Single Responsibility 🚀 `shared/interceptors/logger.interceptor.ts`

```ts
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MainTag.HTTP);

  intercept(ctx: ExecutionContext, next: CallHandler) {
    const { method, url, body } = ctx.switchToHttp().getRequest();
    this.logger.verbose(`[${method}] ${url} - ${JSON.stringify(body)}`);
    return next.handle();       // ✅ única função: logar requisições
  }
}
```

### O — Open/Closed 🚀 `modules/upload/strategies/upload.strategy.factory.ts`

```ts
create(): UploadStrategy {
  switch (this.config.get('UPLOAD_DRIVER')?.toLowerCase()) {
    case 's3':       return new S3UploadStrategy(config);
    case 'supabase': return new SupabaseUploadStrategy(config);
    // ➕ novas estratégias? basta adicionar outro `case`
    default: throw new Error('Unknown upload driver');
  }
}
```

A factory continua **fechada para alteração**; suportar outro storage exige apenas criar uma nova Strategy.

### L — Liskov Substitution 🚀 `modules/favorite/favorite.base.service.ts`

```ts
export abstract class FavoriteBaseService<T> implements FavoriteStrategy<T> {
  protected abstract exists(userId: string, id: string): Promise<boolean>;
  /* …outros contratos… */
}

@Injectable()
export class FavoriteMarketService extends FavoriteBaseService<MarketDto> {
  /* implementação concreta compatível com a base */
}
```

Qualquer serviço derivado pode **substituir** `FavoriteBaseService` sem quebrar consumidores.

### I — Interface Segregation 🚀 `modules/notification/strategies/notification.strategy.ts`

```ts
export interface NotificationStrategy {
  send(params: NotificationParams): Promise<void>; // interface enxuta e específica
}
```

Os clientes lidam apenas com o que **realmente precisam** (enviar notificação), sem métodos supérfluos.

### D — Dependency Inversion 🚀 `modules/upload/upload.service.ts`

```ts
@Injectable()
export class UploadService implements UploadStrategy {
  constructor(@Inject('UploadStrategy') private readonly strategy: UploadStrategy) {}

  async uploadImage(file: Express.Multer.File) { /* … */ return this.strategy.uploadImage(params); }
}
```

Camada de aplicação depende de **abstração**, e não de estratégias concretas — o contêiner do Nest injeta a implementação correta.

---

### Strategy Pattern 🚀 `modules/notification/strategies/send-grid-notification.strategy.ts`

```ts
@Injectable()
export class SendGridEmailNotificationStrategy implements NotificationStrategy {
  async send({ title, body, emails }: NotificationParams) {
    const messages = emails.map(email => ({ to: email, subject: title, html: buildEmailHtml(body) }));
    await sgMail.send(messages, false);
  }
}
```

`DiscordNotificationStrategy`, `ExpoPushNotificationStrategy`, etc., implementam a **mesma interface**; a aplicação escolhe ou combina estratégias em runtime.

### Observer Pattern 🚀 `modules/price/price.listener.ts`

```ts
@OnEvent(EventEnum.PRICE_CREATED)
async handlePriceCreated(price: PriceTimestampDto) {
  const result = await this.priceComparatorService.analyzeNewPrice(price.id);

  if (result.shouldNotify) {
    for (const strategy of this.notificationStrategies) {
      await strategy.send({ /* …dados… */ });
    }
  }
}
```

O listener **observa** eventos de domínio; produtores e consumidores seguem desacoplados.


---

## Licença

MIT © 2025 SmartPreço
