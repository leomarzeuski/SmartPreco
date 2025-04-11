import { DynamicModule, Logger, Module } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Module({})
export class SupabaseModule {
  public static forRoot(): DynamicModule {
    const logger = new Logger();

    const supabaseProvider = {
      provide: SupabaseClient,
      useFactory: () => {
        return createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_KEY,
        );
      }
    };

    logger.debug("Supabase configured! 🚀");
    return {
      module: SupabaseModule,
      providers: [ supabaseProvider ],
      exports: [ supabaseProvider ],
      global: true,
    };
  }
}