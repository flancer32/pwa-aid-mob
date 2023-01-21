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
<layout-center>
    
    <q-card>
        <q-card-section style="text-align: center;">
            <p>Audio recording test.</p>
            <div class="boobs"></div>
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
                ifActive: false,
                ifAudio: true,
                mediaRecorder: MediaRecorder,
            };
        },
        methods: {
            async onOff() {
                const tracks = this.mediaRecorder.stream.getTracks();
                tracks.forEach((track) => track.stop());
                this.ifActive = false;
            },
            async onOn() {
                try {
                    const constraints = {audio: true};
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    this.mediaRecorder = new MediaRecorder(stream);
                    let chunks = [];
                    this.mediaRecorder.ondataavailable = (e) => {
                        chunks.push(e.data);
                    };
                    this.mediaRecorder.onstop = (e) => {
                        const clipContainer = document.createElement('article');
                        const clipLabel = document.createElement('p');
                        const audio = document.createElement('audio');
                        const deleteButton = document.createElement('button');
                        clipContainer.classList.add('clip');
                        audio.setAttribute('controls', '');
                        deleteButton.textContent = 'Delete';
                        clipLabel.textContent = 'Audio Clip';

                        clipContainer.appendChild(audio);
                        clipContainer.appendChild(clipLabel);
                        clipContainer.appendChild(deleteButton);
                        const elBoobs = document.querySelector(`.boobs`);
                        elBoobs.appendChild(clipContainer);

                        audio.controls = true;
                        const blob = new Blob(chunks, {type: "audio/ogg; codecs=opus"});
                        chunks = [];
                        const audioURL = URL.createObjectURL(blob);
                        audio.src = audioURL;
                        console.log("recorder stopped");

                        deleteButton.onclick = (e) => {
                            const evtTgt = e.target;
                            evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
                        };
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
