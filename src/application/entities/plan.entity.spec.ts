import { makeProductFactory } from '@root/test/factories/make-product.factory';
import { makeClientFactory } from '@root/test/factories/make-client.factory';
import { PlanEntity } from './plan.entity';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '../exceptions/bad-request.exception';

describe('PlanEntity', () => {
  describe('validate', () => {
    it('should validate if all validation conditions pass', () => {
      const client = makeClientFactory();

      const product = makeProductFactory({
        minAgeForContract: client.age,
        minAgeForBenefit: client.age + 5,
      });

      const result = PlanEntity.validate({
        client,
        clientId: client.id,
        product,
        productId: product.id,
        ageForRetirement: client.age + 5,
        balance: 0,
        firstContribution: product.minFirstContribution,
        hiredAt: new Date(),
        lastWithdrawal: null,
      });

      expect(result.isRight()).toBeTruthy();
    });

    it('should not validate if first contribution is less than minimum', () => {
      const client = makeClientFactory();

      const product = makeProductFactory();

      const result = PlanEntity.validate({
        client,
        clientId: client.id,
        product,
        productId: product.id,
        ageForRetirement: client.age + 5,
        balance: 0,
        firstContribution: product.minFirstContribution - 5,
        hiredAt: new Date(),
        lastWithdrawal: null,
      });

      expect(result.isLeft()).toBeTruthy();
    });

    it('should not validate if age for contract is less than minimum', () => {
      const client = makeClientFactory();

      const product = makeProductFactory({
        minAgeForContract: client.age + 5,
        minAgeForBenefit: client.age + 10,
      });

      const result = PlanEntity.validate({
        client,
        clientId: client.id,
        product,
        productId: product.id,
        ageForRetirement: client.age + 10,
        balance: 0,
        firstContribution: product.minFirstContribution,
        hiredAt: new Date(),
        lastWithdrawal: null,
      });

      expect(result.isLeft()).toBeTruthy();
    });

    it('should not validate if age for retirement is less than minimum', () => {
      const client = makeClientFactory();

      const product = makeProductFactory({
        minAgeForContract: client.age,
        minAgeForBenefit: client.age + 10,
      });

      const result = PlanEntity.validate({
        client,
        clientId: client.id,
        product,
        productId: product.id,
        ageForRetirement: client.age + 5,
        balance: 0,
        firstContribution: product.minFirstContribution,
        hiredAt: new Date(),
        lastWithdrawal: null,
      });

      expect(result.isLeft()).toBeTruthy();
    });

    it('should not validate if product is not available', () => {
      const client = makeClientFactory();

      const product = makeProductFactory({ endDateToHire: faker.date.soon() });

      const result = PlanEntity.validate({
        client,
        clientId: client.id,
        product,
        productId: product.id,
        ageForRetirement: client.age + 5,
        balance: 0,
        firstContribution: product.minFirstContribution,
        hiredAt: faker.date.future(),
        lastWithdrawal: null,
      });

      expect(result.isLeft()).toBeTruthy();
    });
  });

  describe('deposit', () => {
    it('should deposit a value', () => {
      const client = makeClientFactory();

      const product = makeProductFactory({
        minAgeForContract: client.age,
        minAgeForBenefit: client.age + 5,
        minFirstContribution: 100,
        minExtraContribution: 200,
      });

      const result = PlanEntity.create({
        client,
        clientId: client.id,
        product,
        productId: product.id,
        ageForRetirement: client.age + 5,
        firstContribution: 100,
        hiredAt: new Date(),
      });

      if (result.isLeft()) return console.error(result.value);

      const plan = result.value;

      const deposited = plan.deposit(200);

      expect(deposited.isRight()).toBeTruthy();

      expect(plan.balance).toBe(300);
    });

    it('should not deposit a value lesser than minium', () => {
      const client = makeClientFactory();

      const product = makeProductFactory({
        minAgeForBenefit: client.age + 5,
        minAgeForContract: client.age,
        minFirstContribution: 100,
        minExtraContribution: 200,
      });

      const result = PlanEntity.create({
        client,
        clientId: client.id,
        product,
        productId: product.id,
        ageForRetirement: client.age + 5,
        firstContribution: product.minFirstContribution,
        hiredAt: new Date(),
      });

      if (result.isLeft()) return console.error(result.value);

      const plan = result.value;

      const deposited = plan.deposit(50);

      expect(deposited.isLeft()).toBeTruthy();

      if (deposited.isLeft())
        expect(deposited.value.message).toContain(
          'Contribution must be at least equals to',
        );

      expect(plan.balance).toBe(100);
    });
  });

  describe('withdraw', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should withdraw a value', () => {
      const client = makeClientFactory();

      const product = makeProductFactory({
        minAgeForContract: client.age,
        minAgeForBenefit: client.age + 5,
        minFirstContribution: 100,
        minExtraContribution: 200,
        firstWithdrawalPeriod: 5,
      });

      const result = PlanEntity.create({
        client,
        clientId: client.id,
        product,
        productId: product.id,
        ageForRetirement: client.age + 5,
        firstContribution: 100,
        hiredAt: new Date(),
      });

      jest.advanceTimersByTime(1000 * 60 * 60 * 24 * 5); // 5 days

      if (result.isLeft()) return console.error(result.value);

      const plan = result.value as PlanEntity;

      const withdrawn = plan.withdraw(50);

      expect(withdrawn.isRight()).toBeTruthy();

      expect(plan.balance).toBe(50);
    });

    it('should not withdraw more than balance', () => {
      const client = makeClientFactory();

      const product = makeProductFactory({
        minAgeForContract: client.age,
        minAgeForBenefit: client.age + 5,
        minFirstContribution: 100,
        minExtraContribution: 100,
      });

      const result = PlanEntity.create({
        client,
        clientId: client.id,
        product,
        productId: product.id,
        ageForRetirement: client.age + 5,
        firstContribution: 100,
        hiredAt: new Date(),
      });

      if (result.isLeft()) return console.error(result.value);

      const plan = result.value;

      const withdrawn = plan.withdraw(300);

      expect(withdrawn.isLeft()).toBeTruthy();

      expect(withdrawn.value).toBeInstanceOf(BadRequestException);

      if (withdrawn.isLeft()) {
        expect(withdrawn.value.message).toContain('Insufficient balance.');
      }

      expect(plan.balance).toBe(100);
    });

    it('should not withdraw twice before waiting period', () => {
      const client = makeClientFactory();

      const product = makeProductFactory({
        minAgeForContract: client.age,
        minAgeForBenefit: client.age + 5,
        minFirstContribution: 100,
        minExtraContribution: 200,
        firstWithdrawalPeriod: 5,
        withdrawalPeriod: 30,
      });

      const result = PlanEntity.create({
        client,
        clientId: client.id,
        product,
        productId: product.id,
        ageForRetirement: client.age + 5,
        firstContribution: 100,
        hiredAt: new Date(),
      });

      jest.advanceTimersByTime(1000 * 60 * 60 * 24 * 5); // 5 days

      if (result.isLeft()) return console.error(result.value);

      const plan = result.value as PlanEntity;

      plan.withdraw(50);

      jest.advanceTimersByTime(1000 * 60); // 1 minute

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
      const client = makeClientFactory();

      const product = makeProductFactory({
        minAgeForContract: client.age,
        minAgeForBenefit: client.age + 5,
        minFirstContribution: 100,
        minExtraContribution: 100,
        firstWithdrawalPeriod: 10,
      });

      const result = PlanEntity.create({
        client,
        clientId: client.id,
        product,
        productId: product.id,
        ageForRetirement: client.age + 5,
        firstContribution: 100,
        hiredAt: new Date(),
      });

      if (result.isLeft()) return console.error(result.value);

      const plan = result.value;

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
});
