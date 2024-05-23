import { ClientEntity } from '@/application/entities/client.entity';
import { ConflictResourceException } from '@/application/exceptions/conflict-resource.exception';
import { ClientRepository } from '@/application/repositories/client.repository';
import { Either, left, right } from '@/commons/either';
import { DomainException } from '@/commons/interfaces/domain.exception';
import { Injectable } from '@nestjs/common';

interface RequestParams {
  name: string;
  cpf: string;
  email: string;
  birthDate: Date;
  gender: string;
  monthlyIncome: number;
}

@Injectable()
export class RegisterClientService {
  constructor(private repository: ClientRepository) {}

  async execute(
    data: RequestParams,
  ): Promise<Either<DomainException, ClientEntity>> {
    const clientExists = await this.repository.findByEmailOrCpf(
      data.email,
      data.cpf,
    );

    if (clientExists) {
      return left(new ConflictResourceException('Client already exists'));
    }

    const clientOrError = ClientEntity.create(data);

    if (clientOrError.isLeft()) {
      return left(clientOrError.value);
    }

    await this.repository.create(clientOrError.value);

    return right(clientOrError.value);
  }
}
