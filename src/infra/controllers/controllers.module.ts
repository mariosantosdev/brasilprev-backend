import { Module } from '@nestjs/common';
import { RegisterClientController } from './register-client/register-client.controller';
import { DatabaseModule } from '../database/database.module';
import { RegisterClientService } from '@/application/services/register-client/register-client.service';
import { RegisterProductService } from '@/application/services/register-product/register-product.service';
import { HirePlanService } from '@/application/services/hire-plan/hire-plan.service';
import { InvestExtraContributionService } from '@/application/services/invest-extra-contribution/invest-extra-contribution.service';
import { WithdrawContributionService } from '@/application/services/withdraw-contribution/withdraw-contribution.service';
import { RegisterProductController } from './register-product/register-product.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [RegisterClientController, RegisterProductController],
  providers: [
    HirePlanService,
    InvestExtraContributionService,
    RegisterClientService,
    RegisterProductService,
    WithdrawContributionService,
  ],
})
export class ControllersModule {}
