"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractService = void 0;
class AbstractService {
    constructor(data) {
        this.data = data;
    }
    delete(id) {
        const neededItem = this.data.find((item) => item.id === id);
        if (!neededItem) {
            return;
        }
        this.data = this.data.filter((item) => item.id !== id);
        return neededItem;
    }
    add(newItem) {
        this.data.push(newItem);
        return newItem;
    }
    getById(id) {
        const neededItem = this.data.find((item) => item.id === id);
        if (!neededItem) {
            return;
        }
        return neededItem;
    }
    getByName(name) {
        const neededItem = this.data.find((item) => item.name === name);
        if (!neededItem) {
            return;
        }
        return neededItem;
    }
    getAll() {
        return this.data;
    }
}
exports.AbstractService = AbstractService;
