export class Storage<T> {
    private storage: Map<string, T> = new Map();

    clear(): void {
        this.storage.clear();
    }

    find(id: string): Readonly<T> {
        return this.storage.get(id);
    }

    save(data: T): void {
        this.storage.set(data['id'], data);
    }

    update(id: string, data: T): Readonly<T> {
        const check = this.storage.has(id);
        if (!check) {
            return undefined;
        }
        const entity = this.storage.get(id);
        const newEntity = { ...entity, ...data };
        this.storage.set(id, newEntity);
        return newEntity;
    }

    retore(id: string): Readonly<T> {
        const check = this.storage.has(id);
        if (!check) {
            return undefined;
        }
        const entity = this.storage.get(id);
        if (entity['deleteAt'] === undefined) {
            return undefined;
        }
        entity['deleteAt'] = null;
        this.storage.set(id, entity);
        return entity;
    }

    softDelete(id: string): Readonly<T> {
        const check = this.storage.has(id);
        if (!check) {
            return undefined;
        }
        const entity = this.storage.get(id);
        if (entity['deleteAt'] === undefined) {
            return undefined;
        }
        entity['deleteAt'] = new Date();
        this.storage.set(id, entity);
        return entity;
    }

    delete(id: string): Readonly<T> {
        const check = this.storage.has(id);
        if (!check) {
            return undefined;
        }
        const entity = this.storage.get(id);
        this.storage.delete(id);
        return entity;
    }
}
