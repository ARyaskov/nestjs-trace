# nestjs-trace

Lightweight NestJS tracing (debug print) plugin for controllers and services, supporting Express & Fastify, CJS & ESM.

[![npm version](https://img.shields.io/npm/v/nestjs-trace)](https://www.npmjs.com/package/nestjs-trace)  
[![Module type: MinNode](https://img.shields.io/badge/Node.js->=20-brightgreen)]()
[![Module type: MinNest](https://img.shields.io/badge/Nest.js->=11-brightgreen)]()
---

## Installation

```bash
npm i @riaskov/nestjs-trace
# (Optional, for full decorator metadata support)
npm i -D @swc/core @swc/helpers
```

---

## Usage

### Import the Module

In your `AppModule`:

```ts
import { Module } from "@nestjs/common"
import { TraceModule } from "nestjs-trace"

@Module({
  imports: [TraceModule.forRoot()],
})
export class AppModule {}
```

### Enable Tracing

By default, tracing is disabled. To enable it, set process env variable:

```bash
export ENABLE_METHOD_TRACING=true
```

---

## Features

- **Method Tracing** via `@Trace()` decorator (sync & async methods)
- **HTTP Tracing** via a global interceptor (compatible with Express & Fastify)
- Dual **CJS** & **ESM** bundles out of the box
- Zero runtime dependencies beyond NestJS core

---

## Examples

### 1. Method Tracing

Apply the `@Trace()` decorator to any class method:

```ts
import { Injectable } from "@nestjs/common"
import { Trace } from "nestjs-trace"

@Injectable()
export class MyService {
  @Trace()
  calculate(a: number, b: number): number {
    return a + b
  }

  @Trace()
  async fetchData(id: string): Promise<{ id: string; data: any }> {
    const data = await this.getFromDb(id)
    return { id, data }
  }

  private async getFromDb(id: string): Promise<any> {
    return { foo: 'bar' }
  }
}
```

With `ENABLE_METHOD_TRACING=true`, logs appear as:

```
[Trace] ▶ Enter MyService.calculate with args: [1,2]
[Trace] ◀ Exit MyService.calculate with result: 3

[Trace] ▶ Enter MyService.fetchData with args: ["abc"]
[Trace] ◀ Exit MyService.fetchData with result: {"id":"abc","data":{...}}
```

---

### 2. HTTP Tracing

Enable request/response tracing for all routes:

```ts
import { Controller, Get, Query } from "@nestjs/common"
import { Trace } from "nestjs-trace"
import { MyService } from "./my.service"

@Controller("items")
export class MyController {
  constructor(private readonly svc: MyService) {}

  @Get("sum")
  @Trace()
  sum(
    @Query("a") a: string,
    @Query("b") b: string,
  ): number {
    return this.svc.calculate(Number(a), Number(b))
  }

  @Get("data")
  async data(@Query("id") id: string) {
    return this.svc.fetchData(id)
  }
}
```

Logs for HTTP will look like:

```
[HTTP] ▶ GET /items/sum? a=3&b=5 — body={}, params={}, query={"a":"3","b":"5"}
[Trace] ▶ Enter MyController.sum with args: [3,5]
[Trace] ◀ Exit MyController.sum with result: 8
[HTTP] ◀ GET /items/sum 200 — 5ms
```

---

## Development

```bash
git clone https://github.com/ARyaskov/nestjs-trace.git
cd nestjs-trace
npm i
npm run build
```

---

## 🤝 Contributing

1. Fork this repo 🍴
2. Create a feature branch (`feat/awesome-graph`)
3. Commit your changes and open a Pull Request 🚀

---

## 📄 License

Released under the [MIT License](LICENSE) ❤️
