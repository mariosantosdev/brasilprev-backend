import { BaseEntity } from '@/commons/interfaces/base.entity';
import { Either, left, right } from '@/commons/either';
import { DomainException } from '@/commons/interfaces/domain.exception';
import { cpf } from 'cpf-cnpj-validator';

interface ClientProps {
  name: string;
  cpf: string;
  email: string;
  birthDate: Date;
  gender: string;
  monthlyIncome: number;
}

export class ClientEntity extends BaseEntity<ClientProps> {
  get name(): string {
    return this.props.name;
  }

  get cpf(): string {
    return this.props.cpf;
  }

  get email(): string {
    return this.props.email;
  }

  get birthDate(): Date {
    return this.props.birthDate;
  }

  get age(): number {
    const today = new Date();
    const birthdate = this.props.birthDate;
    const age = today.getUTCFullYear() - birthdate.getUTCFullYear();

    const monthBirthdayIsFuture = today.getUTCMonth() < birthdate.getUTCMonth();
    if (monthBirthdayIsFuture) return age - 1;

    const monthBirthdayIsPast = today.getUTCMonth() > birthdate.getUTCMonth();
    if (monthBirthdayIsPast) return age;

    const dayBirthdayIsFuture = today.getUTCDate() < birthdate.getUTCDate();
    if (dayBirthdayIsFuture) return age - 1;

    return age;
  }

  get gender(): string {
    return this.props.gender;
  }

  get monthlyIncome(): number {
    return this.props.monthlyIncome;
  }

  static validate(props: ClientProps) {
    if (!cpf.isValid(props.cpf)) return false;
    if (props.monthlyIncome < 0) return false;

    return true;
  }

  static create(
    props: ClientProps,
    id?: string,
  ): Either<DomainException, ClientEntity> {
    if (!ClientEntity.validate(props)) {
      return left(new DomainException('Invalid client'));
    }

    return right(new ClientEntity(props, id));
  }

  private constructor(props: ClientProps, id?: string) {
    super(props, id);
  }
}
