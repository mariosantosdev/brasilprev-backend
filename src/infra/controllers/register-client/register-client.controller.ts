import { Body, Controller, Post } from '@nestjs/common';
import { RegisterClientRequestSchema } from './request.schema';
import { plainToClass } from 'class-transformer';
import { RegisterClientResponseSchema } from './response.schema';
import { RegisterClientService } from '@/application/services/register-client/register-client.service';
import { HttpHandleException } from '@/commons/exceptions/http-handle.exception';

@Controller('/clients')
export class RegisterClientController {
  constructor(private service: RegisterClientService) {}

  @Post()
  async handle(@Body() data: RegisterClientRequestSchema) {
    const result = await this.service.execute({
      name: data.nome,
      cpf: data.cpf,
      email: data.email,
      gender: data.genero,
      birthDate: new Date(data.dataDeNascimento),
      monthlyIncome: data.rendaMensal,
    });

    if (result.isLeft()) HttpHandleException(result.value);

    return plainToClass(RegisterClientResponseSchema, result.value);
  }
}
