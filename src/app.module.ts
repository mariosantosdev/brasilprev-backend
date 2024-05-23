import { Module } from '@nestjs/common';
import { HelloWorldController } from './controllers/hello-world/hello-world.controller';
import { HelloWorldService } from './services/hello-world/hello-world.service';
import { RegisterClientService } from './application/services/register-client/register-client.service';
import { RegisterProductService } from './application/services/register-product/register-product.service';

@Module({
  imports: [],
  controllers: [HelloWorldController],
  providers: [HelloWorldService, RegisterClientService, RegisterProductService],
})
export class AppModule {}
