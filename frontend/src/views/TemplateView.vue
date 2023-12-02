<template>
    <section>
        <div class="app_width">
            <div class="toolbar">
                <RouterLink to="/games">
                    <div class="game">
                        <i class="fi fi-rr-arrow-left" style="color: black;"></i>
                        <img src="https://media.gq-magazine.co.uk/photos/645b5c3c8223a5c3801b8b26/16:9/w_1280,c_limit/100-best-games-hp-b.jpg"
                            alt="">
                        <h3>RockPaperScissors</h3>
                    </div>
                </RouterLink>

                <p class="id">Template ID: 1</p>
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
                    <!-- <div class="tool-crop">
                        <VueFeather v-if="stateCrop" type="crop" @click="crop()" />
                        <VueFeather v-else type="crop" @click="applyCrop()" />
                    </div> -->
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
                    <color-picker v-model:pureColor="pureColor" v-model:gradientColor="gradientColor" :isWidget="true" />
                    <br> <br>
                    <PrimaryButton :text="'Save Template'" @click="saveImg" />
                </div>
            </main>
        </div>
    </section>
</template>

<script setup>
import Editor from "./../components/Editor.vue"
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import PrimaryButton from "../components/PrimaryButton.vue";
import { RouterLink } from "vue-router";
</script>
  
<script>
export default {
    data() {
        return {
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
            fontSize: 14
        };
    },
    methods: {
        undo() {
            this.$refs.editor.undo();
        },
        redo() {
            this.$refs.editor.redo();
        },
        deleteEditable() {
            this.$refs.editor.clear();
        },
        freeDrawing() {
            let customizeFreeDrawing = { stroke: this.pureColor, strokeWidth: "5" };
            this.$refs.editor.set("freeDrawing", customizeFreeDrawing);
            this.editor.active = "freeDrawing";
        },
        addText() {
            let textModeOptions = {
                fill: this.pureColor,
                fontFamily: "Space Grotesk",
                fontSize: this.fontSize,
                placeholder: "Type something"
            };
            this.$refs.editor.set("text", textModeOptions);
            this.editor.active = "text";
        },
        addCicle() {
            let circleModeParams = { fill: this.pureColor };
            this.$refs.editor.set("circle", circleModeParams);
            this.editor.active = "circle";
        },
        addSquare() {
            let customizeRectangle = {
                fill: this.pureColor
            };
            this.$refs.editor.set("rect", customizeRectangle);
            this.editor.active = "rect";
        },
        addArrow() {
            let customizeArrow = { stroke: this.pureColor, strokeWidth: "2" };
            this.$refs.editor.set("arrow", customizeArrow);
            this.editor.active = "arrow";
        },
        drag() {
            this.$refs.editor.set("selectMode");
            this.editor.active = "selectMode";
        },
        uploadImg: function (event) {
            this.$refs.editor.uploadImage(event);
        },
        saveImg() {
            const svg = this.$refs.editor.saveImage();
            console.log(svg)
        }
    },
};
</script>
  
<style scoped>
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
