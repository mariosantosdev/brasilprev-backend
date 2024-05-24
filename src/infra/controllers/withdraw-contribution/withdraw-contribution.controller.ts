import { WithdrawContributionService } from '@/application/services/withdraw-contribution/withdraw-contribution.service';
import { Body, Controller, Post } from '@nestjs/common';
import { WithdrawContributionRequestSchema } from './request.schema';
import { HttpHandleException } from '@/commons/exceptions/http-handle.exception';
import { plainToClass } from 'class-transformer';
import { WithdrawContributionResponseSchema } from './response.schema';

@Controller('/plans')
export class WithdrawContributionController {
  constructor(private service: WithdrawContributionService) {}

  @Post('/withdraw')
  async handle(@Body() data: WithdrawContributionRequestSchema) {
    const result = await this.service.execute({
      planId: data.idPlano,
      withdrawalAmount: data.valorResgate,
    });

    if (result.isLeft()) HttpHandleException(result.value);

    return plainToClass(WithdrawContributionResponseSchema, result.value);
  }
}
