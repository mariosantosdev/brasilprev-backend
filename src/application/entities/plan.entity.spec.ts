import { makeProductFactory } from '@root/test/factories/make-product.factory';
import { makeClientFactory } from '@root/test/factories/make-client.factory';
import { PlanEntity } from './plan.entity';
import { faker } from '@faker-js/faker';

describe('PlanEntity', () => {
  const product = makeProductFactory();
  const client = makeClientFactory({
    birthDate: faker.date.birthdate({
      mode: 'age',
      min: product.minAgeForContract,
    }),
  });

  const basePlan = {
    productId: product.id,
    product: product,
    clientId: client.id,
    client: client,
    firstContribution: faker.number.float({
      fractionDigits: 2,
      min: product.minFirstContribution,
    }),
    hiredAt: new Date(),
    ageForRetirement: faker.number.int({ min: product.minAgeForBenefit }),
    lastWithdrawal: null,
    balance: 0,
  };

  it('should validate if all validation conditions pass', () => {
    const result = PlanEntity.validate(basePlan);

    expect(result.isRight()).toBeTruthy();
  });

  it('should not validate if first contribution is less than minimum', () => {
    const result = PlanEntity.validate({
      ...basePlan,
      firstContribution: product.minFirstContribution - 1,
    });

    expect(result.isLeft()).toBeTruthy();
  });

  it('should not validate if age for contract is less than minimum', () => {
    const client = makeClientFactory({
      birthDate: faker.date.birthdate({
        mode: 'age',
        max: product.minAgeForContract - 1,
      }),
    });

    const result = PlanEntity.validate({
      ...basePlan,
      client: client,
      clientId: client.id,
    });

    expect(result.isLeft()).toBeTruthy();
  });

  it('should not validate if age for retirement is less than minimum', () => {
    const result = PlanEntity.validate({
      ...basePlan,
      ageForRetirement: product.minAgeForBenefit - 1,
    });

    expect(result.isLeft()).toBeTruthy();
  });

  it('should not validate if product is not available', () => {
    const localProduct = makeProductFactory();

    const localClient = makeClientFactory({
      birthDate: faker.date.birthdate({
        mode: 'age',
        min: localProduct.minAgeForContract,
      }),
    });

    const result = PlanEntity.validate({
      ...basePlan,
      firstContribution: localProduct.minFirstContribution,
      product: localProduct,
      productId: localProduct.id,
      client: localClient,
      clientId: localClient.id,
      hiredAt: faker.date.future({
        years: localProduct.endDateToHire.getFullYear() + 1,
      }),
    });

    expect(result.isLeft()).toBeTruthy();
  });
});
