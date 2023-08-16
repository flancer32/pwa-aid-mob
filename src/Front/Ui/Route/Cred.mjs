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
/**
 * @param {Aid_Mob_Front_Defaults} DEF
 */
export default function (
    {
        Aid_Mob_Front_Defaults$: DEF,
    }) {
    // VARS
    const template = `
<layout-main>

    <q-card>

        <q-card-actions align="center">
            <q-btn label="Auth" v-on:click="onAuth" />
        </q-card-actions> 

        <q-card-section>
            {{info}}
        </q-card-section>
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
            return {
                info: null,
            };
        },
        methods: {
            async onAuth() {
                // VARS

                // FUNCS

                // MAIN
                this.info = '';
                try {
                    if (navigator.credentials) {
                        this.info += '\nCredentials: TRUE.';
                    } else {
                        this.info += '\nCredentials: FALSE.';
                    }
                    // await navigator.credentials.preventSilentAccess();
                    /** @type {PasswordCredential} */
                    const found = await navigator.credentials.get({password: true});
                    if (found) {
                        this.info += '\nPassword credentials are found.';
                        const id = found.id;
                        const password = found.password;
                        const name = found.name;
                        const iconURL = found.iconURL;
                    } else {
                        this.info += '\nPassword credentials are NOT found.';
                        const credential = new PasswordCredential({
                            id: 'alex@wiredgeese.com',
                            password: 'SomePasswordHere12#@4',
                            name: 'Alex Wiredgeese',
                            iconURL: 'https://www.gravatar.com/avatar/19e5d3174548cc948e1a8b73e5ee7ecd',
                        });
                        await navigator.credentials.store(credential);
                        // const credential2 = new PasswordCredential({
                        //     id: 'alex@flancer32.com',
                        //     password: 'password',
                        //     name: 'Alex F. Lancer',
                        //     iconURL: 'https://www.gravatar.com/avatar/f977617c7f258948227c51cb1769fecd',
                        // });
                        // await navigator.credentials.store(credential2);

                        // const credential2 = new PasswordCredential({
                        //     id: 'teqUser',
                        //     password: 'other',
                        //     name: 'TeqFW User',
                        //     iconURL: 'https://teqfw.com/',
                        // });
                        // await navigator.credentials.store(credential2);
                    }
                } catch (e) {
                    this.info += `Error: ${e}`;
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
