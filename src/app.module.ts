import { Module } from '@nestjs/common';
import { HelloWorldController } from './controllers/hello-world/hello-world.controller';
import { HelloWorldService } from './services/hello-world/hello-world.service';
import { RegisterClientService } from './application/services/register-client/register-client.service';
import { RegisterProductService } from './application/services/register-product/register-product.service';
import { HirePlanService } from './application/services/hire-plan/hire-plan.service';
import { InvestExtraContributionService } from './application/services/invest-extra-contribution/invest-extra-contribution.service';

@Module({
  imports: [],
  controllers: [HelloWorldController],
  providers: [
    HelloWorldService,
    RegisterClientService,
    RegisterProductService,
    HirePlanService,
    InvestExtraContributionService,
  ],
})
export class AppModule {}
