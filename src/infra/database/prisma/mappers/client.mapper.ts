import { ClientEntity } from '@/application/entities/client.entity';
import { Prisma, Client } from '@prisma/client';
import { cpf } from 'cpf-cnpj-validator';

export class ClientMapper {
  static toPrisma(raw: ClientEntity): Prisma.ClientUncheckedCreateInput {
    return {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      cpf: cpf.strip(raw.cpf),
      birthDate: raw.birthDate,
      gender: raw.gender,
      monthlyIncome: raw.monthlyIncome,
    };
  }

  static toDomain(raw: Client): ClientEntity {
    const clientOrError = ClientEntity.create({
      ...raw,
      cpf: cpf.format(raw.cpf),
    });

    if (clientOrError.isLeft()) {
      throw new Error(clientOrError.value.message);
    }

    return clientOrError.value;
  }
}
