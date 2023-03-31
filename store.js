import { PersistMap } from "./miscs";


export const store = new class Store {
    #db;

    constructor() {
        this.#db = new Map();
    }

    bulk_create(keys) {
        for(const key of keys) {
            this.#db.set(key, new PersistMap());
        }
    }

    create(key) {
        this.#db.set(key, new PersistMap());
    }

    get(key) {
        return this.#db.get(key);
    }
}();