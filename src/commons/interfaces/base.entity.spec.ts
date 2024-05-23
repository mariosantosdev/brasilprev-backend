import { BaseEntity } from './base.entity';

interface EntityProps {
  name: string;
}

class Entity extends BaseEntity<EntityProps> {
  get name(): string {
    return this.props.name;
  }
}

describe('BaseEntity', () => {
  it('should generate a random UUID', () => {
    const entity = new Entity({ name: 'test' });

    expect(entity.id).toBeDefined();
  });

  it('should populate props', () => {
    const entity = new Entity({ name: 'test' });

    expect(entity.name).toEqual('test');
  });
});
