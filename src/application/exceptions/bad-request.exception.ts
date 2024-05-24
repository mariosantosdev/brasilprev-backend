import { DomainException } from '@/commons/interfaces/domain.exception';

export class BadRequestException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestException';
  }
}
