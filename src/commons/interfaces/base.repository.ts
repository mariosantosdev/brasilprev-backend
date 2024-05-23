export abstract class BaseRepository<T> {
  abstract create(entity: T): Promise<T>;
  abstract update(entity: T): Promise<T>;
  abstract findById(id: string): Promise<T | null>;
}
