import { ClientEntity } from '@/application/entities/client.entity';
import { ClientRepository } from '@/application/repositories/client.repository';

export class InMemoryClientRepository extends ClientRepository {
  items: ClientEntity[] = [];

  async create(client: ClientEntity) {
    this.items.push(client);
    return client;
  }

  async findById(id: string) {
    return this.items.find((client) => client.id === id);
  }

  async findByEmailOrCpf(email: string, cpf: string) {
    return this.items.find(
      (client) => client.email === email || client.cpf === cpf,
    );
  }

  async update(client: ClientEntity) {
    const index = this.items.findIndex((c) => c.id === client.id);
    this.items[index] = client;
    return client;
  }
}
