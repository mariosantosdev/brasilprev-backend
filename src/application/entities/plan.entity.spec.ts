import { makeProductFactory } from '@root/test/factories/make-product.factory';
import { makeClientFactory } from '@root/test/factories/make-client.factory';
import { PlanEntity } from './plan.entity';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '../exceptions/bad-request.exception';

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
        min: 10,
        max: product.minAgeForContract - 2,
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

  it('should deposit a value', () => {
    const planOrError = PlanEntity.create({
      ...basePlan,
      product: makeProductFactory({ minExtraContribution: 100 }),
    });

    const plan = planOrError.value as PlanEntity;

    const deposited = plan.deposit(100);

    expect(deposited.isRight()).toBeTruthy();

    expect(plan.balance).toBe(100);
  });

  it('should not deposit a value lesser than minium', () => {
    const planOrError = PlanEntity.create(basePlan);

    const plan = planOrError.value as PlanEntity;

    const deposited = plan.deposit(plan.product.minExtraContribution - 1);

    expect(deposited.isLeft()).toBeTruthy();

    if (deposited.isLeft())
      expect(deposited.value.message).toContain(
        'Contribution must be at least equals to',
      );

    expect(plan.balance).toBe(0);
  });

  it('should withdraw a value', () => {
    const planOrError = PlanEntity.create({
      ...basePlan,
      product: makeProductFactory({ firstWithdrawalPeriod: 0 }),
    });

    const plan = planOrError.value as PlanEntity;

    plan.deposit(100);

    const withdrawn = plan.withdraw(50);

    expect(withdrawn.isRight()).toBeTruthy();

    expect(plan.balance).toBe(50);
  });

  it('should not withdraw more than balance', () => {
    const planOrError = PlanEntity.create(basePlan);

    const plan = planOrError.value as PlanEntity;

    plan.deposit(100);

    const withdrawn = plan.withdraw(200);

    expect(withdrawn.isLeft()).toBeTruthy();

    expect(withdrawn.value).toBeInstanceOf(BadRequestException);

    if (withdrawn.isLeft()) {
      expect(withdrawn.value.message).toContain('Insufficient balance.');
    }

    expect(plan.balance).toBe(100);
  });

  it('should not withdraw twice before waiting period', () => {
    const planOrError = PlanEntity.create({
      ...basePlan,
      product: makeProductFactory({
        firstWithdrawalPeriod: 0,
        withdrawalPeriod: 30,
      }),
    });

    const plan = planOrError.value as PlanEntity;

    plan.deposit(100);

    plan.withdraw(50);

    const withdrawn = plan.withdraw(50);

    expect(withdrawn.isLeft()).toBeTruthy();

    if (withdrawn.isLeft()) {
      expect(withdrawn.value.message).toContain(
        'You must wait 30 days to withdraw again.',
      );
    }

    expect(plan.balance).toBe(50);
  });

  it('should not withdraw before first waiting period', () => {
    const planOrError = PlanEntity.create({
      ...basePlan,
      product: makeProductFactory({ firstWithdrawalPeriod: 10 }),
    });

    const plan = planOrError.value as PlanEntity;

    plan.deposit(100);

    const withdrawn = plan.withdraw(50);

    expect(withdrawn.isLeft()).toBeTruthy();

    if (withdrawn.isLeft()) {
      expect(withdrawn.value.message).toEqual(
        'You must wait 10 days to withdraw for the first time.',
      );
    }

    expect(plan.balance).toBe(100);
  });
});
