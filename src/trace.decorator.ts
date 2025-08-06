import { Logger } from "@nestjs/common"
import { METHOD_TRACING_ENABLED } from "./constants"

export function Trace(): MethodDecorator {
  return (_, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    if (!METHOD_TRACING_ENABLED) {
      return descriptor
    }

    const methodName = `${descriptor.value?.name || "<unknown>"}`
    const original = descriptor.value!
    const logger = new Logger("Trace")

    descriptor.value = function (...args: any[]) {
      logger.debug(`▶ Enter ${methodName} with args: ${JSON.stringify(args)}`)
      try {
        const result = original.apply(this, args)
        if (result?.then) {
          return (result as Promise<any>)
            .then((res) => {
              logger.debug(`◀ Exit ${methodName} with result: ${JSON.stringify(res)}`)
              return res
            })
            .catch((err) => {
              logger.error(`‼ Error in ${methodName}: ${err.message}`, err.stack)
              throw err
            })
        }
        logger.debug(`◀ Exit ${methodName} with result: ${JSON.stringify(result)}`)
        return result
      } catch (err: any) {
        logger.error(`‼ Error in ${methodName}: ${err.message}`, err.stack)
        throw err
      }
    }

    return descriptor
  }
}
