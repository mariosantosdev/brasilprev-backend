import { HelloWorldService } from '@/services/hello-world/hello-world.service';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class HelloWorldController {
  constructor(private readonly service: HelloWorldService) {}

  @Get()
  getHello(): string {
    return this.service.getHello();
  }
}
