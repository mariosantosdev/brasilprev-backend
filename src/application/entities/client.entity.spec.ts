import { faker } from '@faker-js/faker';
import { ClientEntity } from './client.entity';
import { cpf } from 'cpf-cnpj-validator';

describe('ClientEntity', () => {
  it('should generate a client entity', () => {
    const client = ClientEntity.create({
      name: faker.person.fullName(),
      cpf: cpf.generate(),
      birthDate: faker.date.past(),
      email: faker.internet.email(),
      gender: faker.person.gender(),
      monthlyIncome: faker.number.float({ fractionDigits: 2 }),
    });

    expect(client.isRight()).toBeTruthy();
  });

  it('should validate entries', () => {
    const isValid = ClientEntity.validate({
      name: faker.person.fullName(),
      cpf: cpf.generate(),
      birthDate: faker.date.past(),
      email: faker.internet.email(),
      gender: faker.person.gender(),
      monthlyIncome: faker.number.float({ fractionDigits: 2 }),
    });

    expect(isValid).toBeTruthy();
  });

  it('should not validate invalid cpf', () => {
    const isValid = ClientEntity.validate({
      name: faker.person.fullName(),
      cpf: 'wrong-cpf',
      birthDate: faker.date.past(),
      email: faker.internet.email(),
      gender: faker.person.gender(),
      monthlyIncome: faker.number.float({ fractionDigits: 2 }),
    });

    expect(isValid).toBeFalsy();
  });

  it('should not validate monthly income less than 0', () => {
    const isValid = ClientEntity.validate({
      name: faker.person.fullName(),
      cpf: cpf.generate(),
      birthDate: faker.date.past(),
      email: faker.internet.email(),
      gender: faker.person.gender(),
      monthlyIncome: -1,
    });

    expect(isValid).toBeFalsy();
  });
});
