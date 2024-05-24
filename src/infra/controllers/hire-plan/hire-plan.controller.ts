import { HirePlanService } from '@/application/services/hire-plan/hire-plan.service';
import { Body, Controller, Post } from '@nestjs/common';
import { HirePlanRequestSchema } from './request.schema';
import { HttpHandleException } from '@/commons/exceptions/http-handle.exception';
import { plainToClass } from 'class-transformer';
import { HirePlanResponseSchema } from './response.schema';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
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
export class HirePlanController {
  constructor(private service: HirePlanService) {}

  @Post('/hire')
  @ApiCreatedResponse({ type: HirePlanResponseSchema })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid request data',
    type: UnprocessableErrorSchema,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data',
    type: HttpErrorSchema,
  })
  @ApiNotFoundResponse({
    description: 'Client or product not found',
    type: HttpErrorSchema,
  })
  @ApiConflictResponse({
    description: 'Client already hired this product',
    type: HttpErrorSchema,
  })
  async handle(@Body() data: HirePlanRequestSchema) {
    const result = await this.service.execute({
      ageForRetirement: data.idadeDeAposentadoria,
      clientId: data.idCliente,
      productId: data.idProduto,
      contribution: data.aporte,
      hiredAt: new Date(data.dataDaContratacao),
    });

    if (result.isLeft()) HttpHandleException(result.value);

    return plainToClass(HirePlanResponseSchema, result.value);
  }
}
