import { WithdrawContributionService } from '@/application/services/withdraw-contribution/withdraw-contribution.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { WithdrawContributionRequestSchema } from './request.schema';
import { HttpHandleException } from '@/commons/exceptions/http-handle.exception';
import { plainToClass } from 'class-transformer';
import { WithdrawContributionResponseSchema } from './response.schema';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  HttpErrorSchema,
  UnprocessableErrorSchema,
} from '@/commons/exceptions/http-error.schema';

@Controller('/plans')
@ApiTags('Plans')
export class WithdrawContributionController {
  constructor(private service: WithdrawContributionService) {}

  @Post('/withdraw')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: WithdrawContributionResponseSchema })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid request data',
    type: UnprocessableErrorSchema,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data',
    type: HttpErrorSchema,
  })
  @ApiNotFoundResponse({ description: 'Plan not found', type: HttpErrorSchema })
  async handle(@Body() data: WithdrawContributionRequestSchema) {
    const result = await this.service.execute({
      planId: data.idPlano,
      withdrawalAmount: data.valorResgate,
    });

    if (result.isLeft()) HttpHandleException(result.value);

    return plainToClass(WithdrawContributionResponseSchema, result.value);
  }
}
