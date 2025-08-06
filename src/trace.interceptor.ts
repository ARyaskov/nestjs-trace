import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from "@nestjs/common"
import { Observable } from "rxjs"
import { tap } from "rxjs/operators"
import { METHOD_TRACING_ENABLED } from "./constants"

@Injectable()
export class TraceInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP")

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (!METHOD_TRACING_ENABLED) {
      return next.handle()
    }

    const http = context.switchToHttp()
    const req: any = http.getRequest<Request>()
    const res: any = http.getResponse<Response>()
    const { method, url, body, params, query } = req
    const start = Date.now()

    this.logger.log(`▶ ${method} ${url} — body=${JSON.stringify(body)}, params=${JSON.stringify(params)}, query=${JSON.stringify(query)}`)

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - start
        this.logger.log(`◀ ${method} ${url} ${res.statusCode} — ${ms}ms`)
      }),
    )
  }
}
