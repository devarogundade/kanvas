
<template>
    <section>
        <div class="app_width">
            <div class="title">
                <h3>RockPaperScissors</h3>
            </div>

            <div class="play">
                <Choice v-if="!cooldown" @userAction="sendUserAction"></Choice>
                <ColdownAnimation v-if="cooldown"></ColdownAnimation>
            </div>
        </div>
    </section>
</template>

<script setup>
import Choice from './components/Choice.vue';
import ColdownAnimation from './components/ColdownAnimation.vue';
</script>

<script>
import { mapMutations } from "vuex";
export default {
    data() {
        return {
            cooldown: false
        }
    },
    methods: {
        ...mapMutations(["setChoice"]),
        sendUserAction(choice) {
            this.setChoice(choice);
            this.cooldown = true;
            setTimeout(() => {
                this.$router.push("/rockpaperscissors/result");
            }, 1000);
        },
    }
}
</script>

<style scoped>
.title {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.title h3 {
    font-size: 40px;
    font-weight: 700;
    text-align: center;
}
</style>