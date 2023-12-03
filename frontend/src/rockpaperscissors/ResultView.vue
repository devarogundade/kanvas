<template>
    <section class="w-screen h-screen min-h-full p-1 flex justify-center items-center flex-col select-none overflow-y-auto"
        :class="{ 'bg-red-500': lost, 'bg-green-500': won, 'bg-sky-600': equal }">
        <Versus :you="yourChoice" :opponent="opponentChoice" class="mb-5"></Versus>
        <div
            class="flex flex-col justify-center items-center pt-3 bg-white/30 backdrop-blur rounded-xl text-center w-11/12 max-w-sm">
            <span v-if="won" class="text-9xl">🏆</span>
            <span v-if="lost" class="text-9xl">👎</span>
            <span v-if="equal" class="text-9xl">🔥</span>
            <h1 v-if="won" class="m-5 text-2xl font-bold text-center">You won ! (+5 points)</h1>
            <h1 v-if="lost" class="m-5 text-2xl font-bold text-center">You lost ! (-1 points)</h1>
            <h1 v-if="equal" class="m-5 text-2xl font-bold text-center">Equal !</h1>
            <button @click="retry" class="bg-white/30 hover:bg-white/40 py-2 rounded-b-xl text-1xl w-full">
                Retry
            </button>
        </div>
    </section>
</template>

<script setup>
import Versus from "./components/Versus.vue";
</script>
  
<script>
import { mapGetters } from "vuex";
import Versus from "./components/Versus.vue";
export default {
    computed: {
        ...mapGetters(["getChoice"]),
    },
    mounted() {
        this.opponentChoice = this.choices[Math.floor(Math.random() * this.choices.length)];
        this.yourChoice = this.getChoice;

        if (this.yourChoice === "") {
            this.$router.push("/");
        } else {
            if (this.yourChoice === this.opponentChoice) {
                this.equal = true;
            } else if (
                (this.yourChoice === "🪨" && this.opponentChoice === "✂️") ||
                (this.yourChoice === "🧻" && this.opponentChoice === "🪨") ||
                (this.yourChoice === "✂️" && this.opponentChoice === "🧻")
            ) {
                this.won = true;

                this.upgradePlayer()
            } else if (
                (this.yourChoice === "🪨" && this.opponentChoice === "🧻") ||
                (this.yourChoice === "🧻" && this.opponentChoice === "✂️") ||
                (this.yourChoice === "✂️" && this.opponentChoice === "🪨")
            ) {
                this.lost = true;

                this.downgradePlayer()
            }
        }
    },
    data() {
        return {
            choices: ["🪨", "🧻", "✂️"],
            equal: false,
            won: false,
            lost: false,
            yourChoice: "",
            opponentChoice: "",
        };
    },
    methods: {
        retry() {
            this.$router.push("/rockpaperscissors");
        },

        upgradePlayer: async function () {
            console.log('upgrade');
        },

        downgradePlayer: async function () {
            console.log('downgrade');
        }
    },
};
</script>
  
<style scoped></style>