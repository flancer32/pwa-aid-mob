/**
 * DTO for startup data for Google Dialogflow session.
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Shared_Dto_Start_Dialogflow';

// MODULE'S CLASSES
/**
 * @memberOf Aid_Mob_Shared_Dto_Start_Dialogflow
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    lang;
    /** @type {string} */
    projectId;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Aid_Mob_Shared_Dto_Start_Dialogflow {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        /**
         * @param {Aid_Mob_Shared_Dto_Start_Dialogflow.Dto} [data]
         * @return {Aid_Mob_Shared_Dto_Start_Dialogflow.Dto}
         */
        this.createDto = function (data) {
            // create new DTO
            const res = new Dto();
            // cast known attributes
            res.lang = castString(data?.lang);
            res.projectId = castString(data?.projectId);
            return res;
        }
    }
}
