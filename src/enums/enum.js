class Enum {

    /**
     *
     * @param {string} name
     */
    constructor(name) {
        this.name = name;
    }

    /**
     *
     * @param {string} value
     * @returns {Enum}
     */
    static fromString(value) {
        const priority = Object.values(this)
            .find(p => p.name === value);

        if (!priority) {
            throw new Error(`Invalid priority: ${value}`);
        }
        return priority;
    }

    toJSON() {
        return this.name;
    }
}

export {Enum};