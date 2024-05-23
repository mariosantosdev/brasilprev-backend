import { faker } from '@faker-js/faker';
import { ClientEntity } from './client.entity';
import { cpf } from 'cpf-cnpj-validator';

describe('ClientEntity', () => {
  const baseClient = {
    name: faker.person.fullName(),
    cpf: cpf.generate(),
    birthDate: faker.date.past(),
    email: faker.internet.email(),
    gender: faker.person.gender(),
    monthlyIncome: faker.number.float({ fractionDigits: 2 }),
  };

  afterEach(() => {
    jest.useRealTimers();
  });

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

  it('should get age for future month', () => {
    const today = new Date(2021, 4, 23);
    jest.useFakeTimers({ now: today.getTime() });

    const clientOrError = ClientEntity.create({
      ...baseClient,
      birthDate: new Date(2000, 8, 4),
    });

    const client = clientOrError.value as ClientEntity;

    expect(client.age).toBe(20);
  });

  it('should get age for past month', () => {
    const today = new Date(2021, 9, 23);
    jest.useFakeTimers({ now: today.getTime() });

    const clientOrError = ClientEntity.create({
      ...baseClient,
      birthDate: new Date(2000, 8, 4),
    });

    const client = clientOrError.value as ClientEntity;

    expect(client.age).toBe(21);
  });

  it('should get age for future day', () => {
    const today = new Date(2021, 8, 1);
    jest.useFakeTimers({ now: today.getTime() });

    const clientOrError = ClientEntity.create({
      ...baseClient,
      birthDate: new Date(2000, 8, 4),
    });

    const client = clientOrError.value as ClientEntity;

    expect(client.age).toBe(20);
  });

  it('should get age at birthday', () => {
    const today = new Date(2021, 8, 4);
    jest.useFakeTimers({ now: today.getTime() });

    const clientOrError = ClientEntity.create({
      ...baseClient,
      birthDate: new Date(2000, 8, 4),
    });

    const client = clientOrError.value as ClientEntity;

    expect(client.age).toBe(21);
  });
});
