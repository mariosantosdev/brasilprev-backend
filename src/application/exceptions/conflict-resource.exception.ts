import { DomainException } from '@/commons/interfaces/domain.exception';

export class ConflictResourceException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictResourceException';
  }
}
