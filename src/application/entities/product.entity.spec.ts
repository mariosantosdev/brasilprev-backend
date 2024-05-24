import { faker } from '@faker-js/faker';
import { ProductEntity } from './product.entity';

describe('ProductEntity', () => {
  const baseProps = {
    name: faker.commerce.productName(),
    susep: faker.string.uuid(),
    endDateToHire: faker.date.future(),
    minFirstContribution: faker.number.float({ fractionDigits: 2 }),
    minExtraContribution: faker.number.float({ fractionDigits: 2 }),
    minAgeForContract: faker.number.int({ max: 21 }),
    minAgeForBenefit: faker.number.int({ min: 21 }),
    firstWithdrawalPeriod: faker.number.int(),
    withdrawalPeriod: faker.number.int(),
  };

  it('should valid properties entries', () => {
    const result = ProductEntity.validate(baseProps);

    expect(result.isRight()).toBeTruthy();
  });

  it('should not valid properties if minAgeForBenefit is less than minAgeForContract', () => {
    const result = ProductEntity.validate({
      ...baseProps,
      minAgeForContract: 20,
      minAgeForBenefit: 18,
    });

    expect(result.isRight()).toBeFalsy();
  });

  it('should not valid properties if endDateToHire is in the past', () => {
    const result = ProductEntity.validate({
      ...baseProps,
      endDateToHire: faker.date.past(),
    });

    expect(result.isRight()).toBeFalsy();
  });
});
