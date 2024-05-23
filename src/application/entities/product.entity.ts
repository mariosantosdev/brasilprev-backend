import { BaseEntity } from '@/commons/interfaces/base.entity';
import { Either, left, right } from '@/commons/either';
import { DomainException } from '@/commons/interfaces/domain.exception';

interface ProductProps {
  name: string;
  susep: string;
  endDateToBuy: Date;
  minFirstContribuition: number;
  minExtraContribuition: number;
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

  get endDateToBuy(): Date {
    return this.props.endDateToBuy;
  }

  get minFirstContribuition(): number {
    return this.props.minFirstContribuition;
  }

  get minExtraContribuition(): number {
    return this.props.minExtraContribuition;
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

  static validate(props: ProductProps) {
    if (props.minAgeForBenefit < props.minAgeForContract) return false;
    if (props.endDateToBuy.getTime() < Date.now()) return false;

    return true;
  }

  static create(
    props: ProductProps,
    id?: string,
  ): Either<DomainException, ProductEntity> {
    if (!ProductEntity.validate(props)) {
      return left(new DomainException('Invalid product'));
    }

    return right(new ProductEntity(props, id));
  }

  private constructor(props: ProductProps, id?: string) {
    super(props, id);
  }
}
