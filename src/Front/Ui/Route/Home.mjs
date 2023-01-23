/**
 * Screen for application's homepage.
 *
 * @namespace Aid_Mob_Front_Ui_Route_Home
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Route_Home';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Aid_Mob_Front_Ui_Route_Home.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Aid_Mob_Front_Defaults} */
    const DEF = spec['Aid_Mob_Front_Defaults$'];

    // VARS
    const template = `
<layout-center xmlns="http://www.w3.org/1999/html">

    <q-card>

        <q-card-actions align="center">
            <q-btn label="Auth" v-on:click="onAuth" />
        </q-card-actions> 

        <q-card-section style="text-align: center;">
            <p>Audio recording test.</p>
            <div class="">{{text}}</div>
            <p v-if="!ifAudio">Media is not supported here.</p>
        </q-card-section>      
        
        <q-card-actions align="center" v-if="ifAudio">
            <q-btn label="On" v-on:click="onOn" />
            <q-btn label="Off" v-on:click="onOff" />
        </q-card-actions> 
        
        <q-card-actions align="center" v-if="ifAudio">
            <q-btn label="Rec" v-on:click="onRec" :disable="!ifActive" />
            <q-btn label="Stop" v-on:click="onStop" :disable="!ifActive" />
        </q-card-actions>  
    </q-card>    
{{response}}    
</layout-center>
`;
    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Aid_Mob_Front_Ui_Route_Home
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {
                authExpire: null,
                authToken: null,
                ifActive: false,
                ifAudio: true,
                mediaRecorder: MediaRecorder,
                response: null,
                text: null,
            };
        },
        methods: {
            async onAuth() {
                // VARS
                const CLIENT_ID = '808769519807-mi592e3dg07kdp0kf4r08ona3n3to2cf.apps.googleusercontent.com';
                const SCOPES = 'https://www.googleapis.com/auth/cloud-platform';
                const me = this;
                const google = self.google;

                // FUNCS
                function onTokenResponse({access_token, token_type, expires_in, scope} = {}) {
                    me.authToken = access_token;
                    me.authExpire = (new Date()).getTime() + expires_in;
                    // TODO: save access token in IDB
                }

                // MAIN
                const client = google.accounts.oauth2.initTokenClient({
                    client_id: CLIENT_ID,
                    scope: SCOPES,
                    callback: onTokenResponse,
                });
                client.requestAccessToken();

            },
            async onOff() {
                const tracks = this.mediaRecorder.stream.getTracks();
                tracks.forEach((track) => track.stop());
                this.ifActive = false;
            },
            async onOn() {
                // VARS
                const uiComp = this;

                // MAIN
                try {
                    const constraints = {audio: true};
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    this.mediaRecorder = new MediaRecorder(stream);
                    let chunks = [];
                    this.mediaRecorder.ondataavailable = (e) => {
                        chunks.push(e.data);
                    };
                    this.mediaRecorder.onstop = (e) => {
                        // FUNCS
                        async function makeRequestToGoogle(b64, token) {
                            const url = 'https://speech.googleapis.com/v1/speech:recognize';
                            const data = {
                                config: {
                                    encoding: 'WEBM_OPUS',
                                    sampleRateHertz: 48000,
                                    languageCode: 'ru-RU',
                                    enableWordTimeOffsets: false
                                },
                                audio: {
                                    content: b64
                                }
                            };

                            const response = await fetch(url, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`,
                                },
                                body: JSON.stringify(data)
                            });

                            const res = await response.json();
                            console.log(JSON.stringify(res));
                            return res;
                        }

                        // MAIN
                        // const clipContainer = document.createElement('article');
                        // const clipLabel = document.createElement('p');
                        // const audio = document.createElement('audio');
                        // const deleteButton = document.createElement('button');
                        // clipContainer.classList.add('clip');
                        // audio.setAttribute('controls', '');
                        // deleteButton.textContent = 'Delete';
                        // clipLabel.textContent = 'Audio Clip';
                        //
                        // clipContainer.appendChild(audio);
                        // clipContainer.appendChild(clipLabel);
                        // clipContainer.appendChild(deleteButton);
                        // const elBoobs = document.querySelector(`.boobs`);
                        // elBoobs.appendChild(clipContainer);
                        // audio.controls = true;

                        const blob = new Blob(chunks, {type: "audio/ogg; codecs=opus"});
                        const reader = new FileReader();
                        reader.readAsDataURL(blob);
                        reader.onload = () => {
                            const b64 = (reader.result).replace('data:audio/ogg; codecs=opus;base64,', '');
                            makeRequestToGoogle(b64, uiComp.authToken)
                                .then((resp) => {
                                    if (Array.isArray(resp?.results)) {
                                        const [result] = resp.results;
                                        if (Array.isArray(result?.alternatives)) {
                                            const [alternative] = result.alternatives;
                                            if (alternative?.transcript) {
                                                uiComp.text = alternative.transcript;
                                            } else {
                                                uiComp.text = null;
                                            }
                                        } else uiComp.text = null;
                                    } else uiComp.text = null;
                                });
                        };

                        chunks = [];
                        // const audioURL = URL.createObjectURL(blob);
                        // audio.src = audioURL;
                        // console.log("recorder stopped");
                        //
                        // deleteButton.onclick = (e) => {
                        //     const evtTgt = e.target;
                        //     evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
                        // };
                    };
                    this.ifActive = true;
                } catch (e) {
                    console.error(`The following error occurred: ${e}`);
                }
            },
            onRec() {
                this.mediaRecorder.start();
            },
            onStop() {
                this.mediaRecorder.stop();
            },
        },
        created() {
            if (!navigator.mediaDevices) {
                this.ifAudio = false;
            }
        },
    };
}
