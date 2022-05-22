import { WithId } from "../types";

export interface IService<T extends WithId> {
  add(dto: any): T | undefined;
  delete(id: T["id"]): T | undefined;
  get(id: T["id"]): T | undefined;
  getAll(): T[];
}

export abstract class AbstractService<T extends WithId> implements IService<T> {
  data: T[];

  constructor(data: T[]) {
    this.data = data;
  }

  delete(id: T["id"]): T | undefined {
    const neededItem = this.data.find((item) => item.id === id);

    if (!neededItem) {
      return;
    }

    this.data.filter((item) => item.id !== id);

    return neededItem;
  }

  add(newItem: T): T | undefined {
    const hasItem = this.data.find((item) => item.id === newItem.id);

    if (hasItem) {
      return;
    }

    this.data.push(newItem);

    return newItem;
  }

  get(id: T["id"]): T | undefined {
    const neededItem = this.data.find((item) => item.id === id);
    if (!neededItem) {
      return;
    }

    return neededItem;
  }

  getAll(): T[] {
    return this.data;
  }
}
