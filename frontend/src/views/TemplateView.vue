<template>
    <section>
        <LoadingBox v-if="fetching" />

        <div class="wrapper">
            <div class="app_width" v-if="game">
                <div class="toolbar">
                    <RouterLink :to="`/games/${$route.params.id}`">
                        <div class="game">
                            <i class="fi fi-rr-arrow-left" style="color: black;"></i>
                            <img :src="game.avatar" alt="">
                            <h3>{{ game.name }}</h3>
                        </div>
                    </RouterLink>
                </div>
                <main>
                    <div class="editor-tools">
                        <div class="tool-drag">
                            <i class="fi fi-rr-location-arrow" :style="editor.active == 'selectMode' ? 'color: pink;' : ''"
                                @click="drag()"></i>
                        </div>
                        <div class="tool-undo">
                            <i class="fi fi-rr-rotate-left" @click="undo()"></i>
                        </div>
                        <div class="tool-redo">
                            <i class="fi fi-rr-rotate-right" @click="redo()"></i>
                        </div>
                        <div class="tool-trash">
                            <i class="fi fi-rr-trash-xmark" @click="deleteEditable()"></i>
                        </div>
                        <div class="tool-freeDrawing">
                            <i class="fi fi-rr-pen-swirl" :style="editor.active == 'freeDrawing' ? 'color: pink;' : ''"
                                @click="freeDrawing()"></i>
                        </div>
                        <div class="tool-addText">
                            <i class="fi fi-rr-text" :style="editor.active == 'text' ? 'color: pink;' : ''"
                                @click="addText()"></i>
                        </div>
                        <div class="tool-addCircle">
                            <i class="fi fi-rr-circle" :style="editor.active == 'circle' ? 'color: pink;' : ''"
                                @click="addCicle()"></i>
                        </div>
                        <div class="tool-addSquare">
                            <i class="fi fi-rr-square" :style="editor.active == 'rect' ? 'color: pink;' : ''"
                                @click="addSquare()"></i>
                        </div>
                        <div class="tool-arrow">
                            <i class="fi fi-rr-arrow-up-right" :style="editor.active == 'arrow' ? 'color: pink;' : ''"
                                @click="addArrow()"></i>
                        </div>
                        <div class="tool-upload">
                            <label for="file">
                                <i class="fi fi-rr-file-import"></i>
                            </label>
                            <input type="file" id="file" ref="file" style="display: none;" :v-model="file" accept="image/*"
                                @change="uploadImg">
                        </div>
                    </div>
                    <div class="canvas">
                        <Editor :canvasWidth="canvasWidth" :canvasHeight="canvasHeight" ref="editor" />
                    </div>
                    <div class="options">
                        <p>Font Size</p>
                        <input type="number"
                            style="margin-bottom: 16px; border: 1px solid #ccc; padding: 8px; outline: none; border-radius: 6px;"
                            placeholder="0px" v-model="fontSize">
                        <color-picker v-model:pureColor="pureColor" v-model:gradientColor="gradientColor"
                            :isWidget="true" />
                        <br> <br>
                        <PrimaryButton :progress="saving" :text="'Save Template'" @click="saveImg" />
                    </div>
                </main>
            </div>
        </div>
    </section>
</template>

<script setup>
import Editor from "./../components/Editor.vue"
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import PrimaryButton from "../components/PrimaryButton.vue";
import { RouterLink } from "vue-router";
import LoadingBox from '../components/LoadingBox.vue';
</script>
  
<script>
import { fetchGame } from '../scripts/graph';
import { tryAddTemplate } from "../scripts/kanvas";
import { upload } from "../scripts/storage";
import { notify } from "../reactives/notify"
export default {
    data() {
        return {
            game: null,
            fetching: true,
            pureColor: 'red',
            gradientColor: 'red',
            canvasWidth: "500",
            canvasHeight: "600",
            stateCrop: true,
            file: "",
            editor: {
                mode: "FreeDearaw",
                active: "selectMode"
            },
            fontSize: 14,
            saving: false
        };
    },
    mounted() {
        this.getGame()
    },
    methods: {
        getGame: async function () {
            this.fetching = true
            this.game = await fetchGame(this.$route.params.id)
            this.fetching = false
        },
        undo: function () {
            this.$refs.editor.undo();
        },
        redo: function () {
            this.$refs.editor.redo();
        },
        deleteEditable: function () {
            this.$refs.editor.clear();
        },
        freeDrawing: function () {
            let customizeFreeDrawing = { stroke: this.pureColor, strokeWidth: "5" };
            this.$refs.editor.set("freeDrawing", customizeFreeDrawing);
            this.editor.active = "freeDrawing";
        },
        addText: function () {
            let textModeOptions = {
                fill: this.pureColor,
                fontFamily: "Space Grotesk",
                fontSize: this.fontSize,
                placeholder: "Type something"
            };
            this.$refs.editor.set("text", textModeOptions);
            this.editor.active = "text";
        },
        addCicle: function () {
            let circleModeParams = { fill: this.pureColor };
            this.$refs.editor.set("circle", circleModeParams);
            this.editor.active = "circle";
        },
        addSquare: function () {
            let customizeRectangle = {
                fill: this.pureColor
            };
            this.$refs.editor.set("rect", customizeRectangle);
            this.editor.active = "rect";
        },
        addArrow: function () {
            let customizeArrow = { stroke: this.pureColor, strokeWidth: "2" };
            this.$refs.editor.set("arrow", customizeArrow);
            this.editor.active = "arrow";
        },
        drag: function () {
            this.$refs.editor.set("selectMode");
            this.editor.active = "selectMode";
        },
        uploadImg: function (event) {
            this.$refs.editor.uploadImage(event);
        },
        saveImg: async function () {
            if (this.saving) return
            this.saving = true

            const svgString = this.$refs.editor.saveImage();
            console.log(svgString);

            const blob = new Blob([svgString], { type: 'image/svg+xml' });

            const url = await upload(blob, `templates/${this.$route.params.id}/${this.game.templates.length}`);

            const transaction = await tryAddTemplate(url, this.$route.params.id);
            if (transaction) {
                notify.push({
                    title: "Transaction sent ✔️",
                    description: "Template was created successfully!",
                    category: "success",
                    linkTitle: "View Tnx",
                    linkUrl: `https://testnet.snowtrace.io/tx/${transaction.transactionHash}`
                });
                this.$router.push(`/games/${this.$route.params.id}`);
            }
            else {
                notify.push({
                    title: "Transaction failed ❌",
                    description: "Please try again!",
                    category: "error",
                });
            }

            this.saving = false
        }
    },
};
</script>
  
<style scoped>
.wrapper {
    min-height: 80vh;
}

.toolbar {
    margin-top: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.game {
    display: flex;
    align-items: center;
    gap: 20px;
}

.game img {
    width: 50px;
    height: 40px;
    border-radius: 6px;
    object-fit: cover;
}

.game h3 {
    font-size: 24px;
    color: var(--text-normal);
}

main {
    padding: 60px 0;
    min-height: 800px;
    display: flex;
    justify-content: space-between;
}

.editor-tools {
    display: flex;
    flex-direction: column;
    width: 50px;
    gap: 20px;
    background: var(--pr);
    align-items: center;
    padding: 20px;
    height: fit-content;
    border-radius: 12px;
}

#file {
    width: 1px;
    height: 1px;
    visibility: hidden;
}

.canvas {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 18px 50px -10px;
    background: white;
    height: fit-content;
}

.options {
    border-radius: 12px;
    height: fit-content;
    width: 280px;
}

i {
    color: #fff;
    font-size: 24px;
    cursor: pointer;
}
</style>
