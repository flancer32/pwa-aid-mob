/**
 * DTO for some command being sent from browser to back-end.
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Shared_Dto_Deepgram_Command';

/**
 * @memberOf Aid_Mob_Shared_Dto_Deepgram_Command
 */
export const Name = {
    STOP: 'STOP',
}

// MODULE'S CLASSES

/**
 * @memberOf Aid_Mob_Shared_Dto_Deepgram_Command
 */
class Dto {
    static namespace = NS;
    /**
     * Name of the command (@see Aid_Mob_Shared_Dto_Deepgram_Command.Name)
     * @type {string}
     */
    name;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Aid_Mob_Shared_Dto_Deepgram_Command {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castEnum|function} castEnum
     */
    constructor(
        {
            ['TeqFw_Core_Shared_Util_Cast.castEnum']: castEnum,
        }) {
        /**
         * @param {Aid_Mob_Shared_Dto_Deepgram_Command.Dto} [data]
         * @return {Aid_Mob_Shared_Dto_Deepgram_Command.Dto}
         */
        this.createDto = function (data) {
            // create new DTO
            const res = new Dto();
            // cast known attributes
            res.name = castEnum(data?.name, Name);
            return res;
        }
    }
}
