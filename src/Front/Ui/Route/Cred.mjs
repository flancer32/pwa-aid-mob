/**
 * Screen for Credentials API tests.
 *
 * @namespace Aid_Mob_Front_Ui_Route_Cred
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Route_Cred';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Aid_Mob_Front_Ui_Route_Cred.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Aid_Mob_Front_Defaults} */
    const DEF = spec['Aid_Mob_Front_Defaults$'];

    // VARS
    const template = `
<layout-center>

    <q-card>

        <q-card-actions align="center">
            <q-btn label="Auth" v-on:click="onAuth" />
        </q-card-actions> 

    </q-card>    

</layout-center>
`;
    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Aid_Mob_Front_Ui_Route_Cred
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {};
        },
        methods: {
            async onAuth() {
                // VARS

                // FUNCS

                // MAIN
                try {
                    await navigator.credentials.preventSilentAccess();
                    /** @type {PasswordCredential} */
                    const found = await navigator.credentials.get({password: true});
                    if (found) {
                        const id = found.id;
                        const password = found.password;
                        const name = found.name;
                        const iconURL = found.iconURL;
                    } else {
                        const credential = new PasswordCredential({
                            id: 'email',
                            password: 'priv&pub.keys',
                            name: 'Alex Gusev',
                            iconURL: 'https://some.address.com/icon',
                        });
                        await navigator.credentials.store(credential);
                        // const credential2 = new PasswordCredential({
                        //     id: 'teqUser',
                        //     password: 'other',
                        //     name: 'TeqFW User',
                        //     iconURL: 'https://teqfw.com/',
                        // });
                        // await navigator.credentials.store(credential2);
                    }
                } catch (e) {
                    debugger
                }
            },
        },
        created() {
            if (!navigator.mediaDevices) {
                this.ifAudio = false;
            }
        },
    };
}
