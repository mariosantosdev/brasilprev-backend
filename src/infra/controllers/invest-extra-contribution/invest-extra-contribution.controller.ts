import { InvestExtraContributionService } from '@/application/services/invest-extra-contribution/invest-extra-contribution.service';
import { Body, Controller, Post } from '@nestjs/common';
import { InvestExtraContributionRequestSchema } from './request.schema';
import { InvestExtraContributionResponseSchema } from './response.schema';
import { HttpHandleException } from '@/commons/exceptions/http-handle.exception';
import { plainToClass } from 'class-transformer';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  HttpErrorSchema,
  UnprocessableErrorSchema,
} from '@/commons/exceptions/http-error.schema';

@Controller('/plans')
@ApiTags('Plans')
export class InvestExtraContributionController {
  constructor(private service: InvestExtraContributionService) {}

  @Post('/extra-contribution')
  @ApiCreatedResponse({ type: InvestExtraContributionResponseSchema })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid request data',
    type: UnprocessableErrorSchema,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data',
    type: HttpErrorSchema,
  })
  @ApiNotFoundResponse({
    description: 'Client or plan not found',
    type: HttpErrorSchema,
  })
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
