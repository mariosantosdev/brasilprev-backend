import { ClientEntity } from '@/application/entities/client.entity';
import { cpf } from 'cpf-cnpj-validator';
import { faker } from '@faker-js/faker';

type OverridesParams = Partial<Omit<ClientEntity, 'age'>>;

export function makeClientFactory(overrides?: OverridesParams): ClientEntity {
  const client = ClientEntity.create(
    {
      name: overrides?.name ?? faker.person.fullName(),

      cpf: overrides?.cpf ?? cpf.generate(),

      birthDate: overrides?.birthDate ?? faker.date.past(),

      email: overrides?.email ?? faker.internet.email(),

      gender: overrides?.gender ?? faker.person.gender(),

      monthlyIncome:
        overrides?.monthlyIncome ?? faker.number.float({ fractionDigits: 2 }),
    },
    overrides?.id,
  );

  return client.value as ClientEntity;
}
