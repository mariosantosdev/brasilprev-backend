import { Body, Controller, Post } from '@nestjs/common';
import { RegisterClientRequestSchema } from './request.schema';
import { plainToClass } from 'class-transformer';
import { RegisterClientResponseSchema } from './response.schema';
import { RegisterClientService } from '@/application/services/register-client/register-client.service';
import { HttpHandleException } from '@/commons/exceptions/http-handle.exception';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  HttpErrorSchema,
  UnprocessableErrorSchema,
} from '@/commons/exceptions/http-error.schema';

@Controller('/clients')
@ApiTags('Clients')
export class RegisterClientController {
  constructor(private service: RegisterClientService) {}

  @Post()
  @ApiCreatedResponse({ type: RegisterClientResponseSchema })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid request data',
    type: UnprocessableErrorSchema,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data',
    type: HttpErrorSchema,
  })
  @ApiConflictResponse({
    description: 'Client already exists',
    type: HttpErrorSchema,
  })
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
