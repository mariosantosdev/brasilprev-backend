import { ClientEntity } from '@/application/entities/client.entity';
import { cpf } from 'cpf-cnpj-validator';
import { faker } from '@faker-js/faker';

export function makeClientFactory(): ClientEntity {
  const client = ClientEntity.create({
    name: faker.person.fullName(),
    cpf: cpf.generate(),
    birthDate: faker.date.past(),
    email: faker.internet.email(),
    gender: faker.person.gender(),
    monthlyIncome: faker.number.float({ fractionDigits: 2 }),
  });

  return client.value as ClientEntity;
}
