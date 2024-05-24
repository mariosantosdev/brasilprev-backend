import { BaseEntity } from '@/commons/interfaces/base.entity';
import { Either, left, right } from '@/commons/either';
import { DomainException } from '@/commons/interfaces/domain.exception';
import { ProductEntity } from './product.entity';
import { ClientEntity } from './client.entity';

interface PlanProps {
  productId: string;
  product: ProductEntity;
  clientId: string;
  client: ClientEntity;
  firstContribution: number;
  hiredAt: Date;
  ageForRetirement: number;
  lastWithdrawal: Date | null;
  balance: number;
}

type CreatePlanProps = Omit<PlanProps, 'balance' | 'lastWithdrawal'>;

export class PlanEntity extends BaseEntity<PlanProps> {
  get productId(): string {
    return this.props.productId;
  }

  get product(): ProductEntity {
    return this.props.product;
  }

  get clientId(): string {
    return this.props.clientId;
  }

  get client(): ClientEntity {
    return this.props.client;
  }

  get firstContribution(): number {
    return this.props.firstContribution;
  }

  get hiredAt(): Date {
    return this.props.hiredAt;
  }

  get ageForRetirement(): number {
    return this.props.ageForRetirement;
  }

  get lastWithdrawal(): Date {
    return this.props.lastWithdrawal;
  }

  get balance(): number {
    return this.props.balance;
  }

  static validate(props: PlanProps): Either<DomainException, true> {
    if (props.firstContribution < props.product.minFirstContribuition) {
      const minFirstContribution = props.product.minFirstContribuition;
      return left(
        new DomainException(
          `Invalid first contribution. Minimum first contribution is ${minFirstContribution}`,
        ),
      );
    }

    if (props.client.age < props.product.minAgeForContract) {
      const minAge = props.product.minAgeForContract;
      return left(
        new DomainException(
          `Invalid age for contract. Minimum age is ${minAge}`,
        ),
      );
    }

    if (props.ageForRetirement < props.product.minAgeForBenefit) {
      const minAge = props.product.minAgeForBenefit;
      return left(
        new DomainException(
          `Invalid age for retirement. Minimum age is ${minAge}`,
        ),
      );
    }

    if (props.hiredAt.getTime() > props.product.endDateToBuy.getTime()) {
      return left(new DomainException('Product is not available'));
    }

    return right(true);
  }

  static create(
    props: CreatePlanProps,
    id?: string,
  ): Either<DomainException, PlanEntity> {
    const data: PlanProps = {
      balance: 0,
      lastWithdrawal: null,
      ...props,
    };

    if (!PlanEntity.validate(data)) {
      return left(new DomainException('Invalid plan'));
    }

    return right(new PlanEntity(data, id));
  }

  private constructor(props: PlanProps, id?: string) {
    super(props, id);
  }
}
