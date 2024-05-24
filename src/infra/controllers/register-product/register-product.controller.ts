import { RegisterProductService } from '@/application/services/register-product/register-product.service';
import { Body, Controller, Post } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { RegisterProductResponseSchema } from './response.schema';
import { HttpHandleException } from '@/commons/exceptions/http-handle.exception';
import { RegisterProductRequestSchema } from './request.schema';

@Controller('/products')
export class RegisterProductController {
  constructor(private service: RegisterProductService) {}

  @Post()
  async handle(@Body() data: RegisterProductRequestSchema) {
    const result = await this.service.execute({
      name: data.nome,
      susep: data.susep,
      endDateToHire: new Date(data.expiracaoDeVenda),
      firstWithdrawalPeriod: data.carenciaInicialDeResgate,
      minAgeForBenefit: data.idadeDeSaida,
      minAgeForContract: data.idadeDeEntrada,
      minExtraContribution: data.valorMinimoAporteExtra,
      minFirstContribution: data.valorMinimoAporteInicial,
      withdrawalPeriod: data.carenciaEntreResgates,
    });

    if (result.isLeft()) HttpHandleException(result.value);

    return plainToClass(RegisterProductResponseSchema, result.value);
  }
}
