import { InvestExtraContributionService } from '@/application/services/invest-extra-contribution/invest-extra-contribution.service';
import { Body, Controller, Post } from '@nestjs/common';
import { InvestExtraContributionRequestSchema } from './request.schema';
import { InvestExtraContributionResponseSchema } from './response.schema';
import { HttpHandleException } from '@/commons/exceptions/http-handle.exception';
import { plainToClass } from 'class-transformer';

@Controller('/plans')
export class InvestExtraContributionController {
  constructor(private service: InvestExtraContributionService) {}

  @Post('/extra-contribution')
  async investExtraContribution(
    @Body() data: InvestExtraContributionRequestSchema,
  ) {
    const result = await this.service.execute({
      clientId: data.idCliente,
      planId: data.idPlano,
      extraContribution: data.valorAporte,
    });

    if (result.isLeft()) HttpHandleException(result.value);

    return plainToClass(InvestExtraContributionResponseSchema, result.value);
  }
}
