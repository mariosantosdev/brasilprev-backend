import { BaseEntity } from '@/commons/interfaces/base.entity';
import { Either, left, right } from '@/commons/either';
import { DomainException } from '@/commons/interfaces/domain.exception';
import { ProductEntity } from './product.entity';
import { ClientEntity } from './client.entity';
import { BadRequestException } from '../exceptions/bad-request.exception';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

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
  public deposit(amount: number): Either<DomainException, true> {
    if (amount <= this.product.minExtraContribution) {
      const minExtraContribution = this.product.minExtraContribution;
      return left(
        new BadRequestException(
          `Contribution must be greater than ${minExtraContribution}`,
        ),
      );
    }

    this.props.balance += amount;

    return right(true);
  }

  public withdraw(amount: number): Either<DomainException, true> {
    if (amount > this.balance) {
      return left(new BadRequestException('Insufficient balance.'));
    }

    const waitingPeriodInDays = this.product.withdrawalPeriod;

    const lastWithdrawalDate = dayjs(this.lastWithdrawal).utc();
    const daysSinceLastWithdrawal = dayjs()
      .utc()
      .diff(lastWithdrawalDate, 'days');

    if (daysSinceLastWithdrawal < waitingPeriodInDays) {
      const restDays = waitingPeriodInDays - daysSinceLastWithdrawal;

      return left(
        new BadRequestException(
          `You must wait ${restDays} days to withdraw again.`,
        ),
      );
    }

    this.props.balance -= amount;
    this.props.lastWithdrawal = new Date();

    return right(true);
  }

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
    if (props.firstContribution < props.product.minFirstContribution) {
      const minFirstContribution = props.product.minFirstContribution;
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

    if (props.hiredAt.getTime() > props.product.endDateToHire.getTime()) {
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
