import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { RegisterClientService } from './application/services/register-client/register-client.service';
import { RegisterProductService } from './application/services/register-product/register-product.service';
import { HirePlanService } from './application/services/hire-plan/hire-plan.service';
import { InvestExtraContributionService } from './application/services/invest-extra-contribution/invest-extra-contribution.service';
import { WithdrawContributionService } from './application/services/withdraw-contribution/withdraw-contribution.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    RegisterClientService,
    RegisterProductService,
    HirePlanService,
    InvestExtraContributionService,
    WithdrawContributionService,
  ],
})
export class AppModule {}
