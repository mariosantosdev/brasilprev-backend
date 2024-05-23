import { Module } from '@nestjs/common';
import { HelloWorldController } from './controllers/hello-world/hello-world.controller';
import { HelloWorldService } from './services/hello-world/hello-world.service';

@Module({
  imports: [],
  controllers: [HelloWorldController],
  providers: [HelloWorldService],
})
export class AppModule {}
