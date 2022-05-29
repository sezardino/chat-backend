import { WithId, WithName } from "../types";

export interface IService<T extends WithId> {
  add(dto: any): T | undefined;
  delete(id: T["id"]): T | undefined;
  getById(id: T["id"]): T | undefined;
  getByName(id: T["id"]): T | undefined;
  getAll(): T[];
}

export abstract class AbstractService<T extends WithId & WithName>
  implements IService<T>
{
  protected data: T[];

  constructor(data: T[]) {
    this.data = data;
  }

  delete(id: T["id"]): T | undefined {
    const neededItem = this.data.find((item) => item.id === id);

    if (!neededItem) {
      return;
    }

    this.data = this.data.filter((item) => item.id !== id);

    return neededItem;
  }

  add(newItem: T): T {
    this.data.push(newItem);

    return newItem;
  }

  getById(id: T["id"]): T | undefined {
    const neededItem = this.data.find((item) => item.id === id);
    if (!neededItem) {
      return;
    }

    return neededItem;
  }

  getByName(name: T["name"]): T | undefined {
    const neededItem = this.data.find((item) => item.name === name);
    if (!neededItem) {
      return;
    }

    return neededItem;
  }

  getAll(): T[] {
    return this.data;
  }
}
