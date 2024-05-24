import { DomainException } from '@/commons/interfaces/domain.exception';

export class ResourceNotFoundException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'ResourceNotFoundException';
  }
}
