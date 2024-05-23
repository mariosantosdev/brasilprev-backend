import { BaseRepository } from '@/commons/interfaces/base.repository';
import { ClientEntity } from '../entities/client.entity';

export abstract class ClientRepository extends BaseRepository<ClientEntity> {
  abstract findByEmailOrCpf(
    email: string,
    cpf: string,
  ): Promise<ClientEntity | undefined>;
}
