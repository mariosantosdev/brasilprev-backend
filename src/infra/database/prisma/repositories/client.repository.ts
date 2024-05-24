import { ClientEntity } from '@/application/entities/client.entity';
import { ClientRepository } from '@/application/repositories/client.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ClientMapper } from '../mappers/client.mapper';

@Injectable()
export class PrismaClientRepository implements ClientRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmailOrCpf(email: string, cpf: string): Promise<ClientEntity> {
    const client = await this.prisma.client.findFirst({
      where: {
        OR: [{ email }, { cpf }],
      },
    });

    if (!client) return null;

    return ClientMapper.toDomain(client);
  }

  async create(entity: ClientEntity): Promise<ClientEntity> {
    const data = ClientMapper.toPrisma(entity);

    await this.prisma.client.create({ data });

    return entity;
  }

  async update(entity: ClientEntity): Promise<ClientEntity> {
    const data = ClientMapper.toPrisma(entity);

    await this.prisma.client.update({ data, where: { id: entity.id } });

    return entity;
  }

  async findById(id: string): Promise<ClientEntity> {
    const client = await this.prisma.client.findFirst({ where: { id } });

    if (!client) return null;

    return ClientMapper.toDomain(client);
  }
}
