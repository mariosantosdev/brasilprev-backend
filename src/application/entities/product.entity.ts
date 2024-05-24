import { BaseEntity } from '@/commons/interfaces/base.entity';
import { Either, left, right } from '@/commons/either';
import { DomainException } from '@/commons/interfaces/domain.exception';

interface ProductProps {
  name: string;
  susep: string;
  endDateToHire: Date;
  minFirstContribution: number;
  minExtraContribution: number;
  minAgeForContract: number;
  minAgeForBenefit: number;
  firstWithdrawalPeriod: number;
  withdrawalPeriod: number;
}

export class ProductEntity extends BaseEntity<ProductProps> {
  get name(): string {
    return this.props.name;
  }

  get susep(): string {
    return this.props.susep;
  }

  get endDateToHire(): Date {
    return this.props.endDateToHire;
  }

  get minFirstContribution(): number {
    return this.props.minFirstContribution;
  }

  get minExtraContribution(): number {
    return this.props.minExtraContribution;
  }

  get minAgeForContract(): number {
    return this.props.minAgeForContract;
  }

  get minAgeForBenefit(): number {
    return this.props.minAgeForBenefit;
  }

  get firstWithdrawalPeriod(): number {
    return this.props.firstWithdrawalPeriod;
  }

  get withdrawalPeriod(): number {
    return this.props.withdrawalPeriod;
  }

  static validate(props: ProductProps): Either<DomainException, true> {
    if (props.minAgeForContract > props.minAgeForBenefit) {
      return left(
        new DomainException(
          'Minimum age for benefit must be greater than minimum age for contract',
        ),
      );
    }

    if (props.endDateToHire.getTime() < Date.now()) {
      return left(new DomainException('Product is not available'));
    }

    return right(true);
  }

  static create(
    props: ProductProps,
    id?: string,
  ): Either<DomainException, ProductEntity> {
    const isValid = ProductEntity.validate(props);

    if (isValid.isLeft()) return left(isValid.value);

    return right(new ProductEntity(props, id));
  }

  private constructor(props: ProductProps, id?: string) {
    super(props, id);
  }
}
