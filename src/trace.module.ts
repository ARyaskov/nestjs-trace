import { Module, DynamicModule } from "@nestjs/common"
import { TraceInterceptor } from "./trace.interceptor"
import { APP_INTERCEPTOR } from "@nestjs/core"

@Module({})
export class TraceModule {
  static forRoot(): DynamicModule {
    return {
      module: TraceModule,
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: TraceInterceptor,
        },
      ],
    }
  }
}
