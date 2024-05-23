import { randomUUID } from 'crypto';

export class BaseEntity<T> {
  private _id: string;
  protected props: T;

  constructor(props: T, id?: string) {
    this.props = props;
    this._id = id ?? randomUUID();
  }

  get id(): string {
    return this._id;
  }
}
