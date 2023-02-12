/**
 * Record an audio.
 *
 * @namespace Aid_Mob_Front_Ui_Route_Record
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Route_Record';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Aid_Mob_Front_Ui_Route_Record.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Aid_Mob_Front_Defaults} */
    const DEF = spec['Aid_Mob_Front_Defaults$'];

    // VARS
    const template = `
<layout-main>

    <q-card>

        <template v-if="!ifAudio">
            <q-card-section style="text-align: center;">
                <div>Media is not supported here.</div>
            </q-card-section>
        </template>

        <template v-if="ifAudio">
            <q-card-section style="text-align: center;">
                <div>Record an audio.</div>
                <audio controls :src="audioUrl"/>
                <div><a :href="audioUrl">Save link as...</a></div>
            </q-card-section>

            <q-card-actions align="center">
                <q-btn label="Rec" v-on:click="onRec" :disable="ifActive" color="primary" icon="mic"/>
                <q-btn label="Stop" v-on:click="onStop" :disable="!ifActive" color="primary" icon="mic_off"/>
            </q-card-actions>
        </template>

    </q-card>

</layout-main>
`;
    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Aid_Mob_Front_Ui_Route_Record
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {
                audioUrl: null,
                ifActive: false,
                ifAudio: true, // 'true' if Media is supported in the browser
                mediaRecorder: MediaRecorder,
            };
        },
        methods: {
            async onRec() {
                try {
                    // clean up previous URL
                    if (this.audioUrl) URL.revokeObjectURL(this.audioUrl);

                    // open audio stream and init recorder
                    const constraints = {audio: true};
                    /** @type {MediaStream} */
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    this.ifActive = true;
                    const recorder = new MediaRecorder(stream);
                    const chunks = [];

                    // collect audio data
                    recorder.addEventListener('dataavailable', (e) => {
                        chunks.push(e.data);
                    });


                    recorder.addEventListener('stop', () => {
                        // convert chunks to one Blob and get URL for this Blob
                        const blob = new Blob(chunks, {type: "audio/ogg; codecs=opus"});
                        this.audioUrl = URL.createObjectURL(blob);
                    });

                    // save recorder to UiComponent and start recording
                    this.mediaRecorder = recorder;
                    this.mediaRecorder.start();
                } catch (e) {
                    console.error(`The following error occurred: ${e}`);
                }
            },
            onStop() {
                this.ifActive = false;
                if (typeof this.mediaRecorder?.stop === 'function') this.mediaRecorder.stop();
                // close audio stream
                const tracks = this.mediaRecorder?.stream.getTracks() ?? [];
                tracks.forEach((track) => track.stop());
            },
        },
        created() {
            this.ifAudio = !!navigator.mediaDevices;
        },
    };
}
