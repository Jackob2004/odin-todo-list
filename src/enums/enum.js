/**
 * @module enum
 */

class Enum {

    /**
     *
     * @param {string} name
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * @param {string} value
     * @throws {Error} if enum value doesn't exist
     * @returns {Enum}
     */
    static fromString(value) {
        const enumValue = Object.values(this)
            .find(p => p.name === value);

        if (!enumValue) {
            throw new Error(`Invalid enum value: ${value}`);
        }
        return enumValue;
    }

    toJSON() {
        return this.name;
    }
}

export {Enum};