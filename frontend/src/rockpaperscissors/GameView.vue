<template>
    <section class="section_header">
        <div class="app_width">
            <header>
                <RouterLink to="/rockpaperscissors">
                    <div class="logo">
                        <p>RockPaperScissors</p>
                    </div>
                </RouterLink>

                <div class="actions">
                    <RouterLink to="/games">
                        <PrimaryButton width="240px" text="GitHub" />
                    </RouterLink>
                </div>
            </header>
        </div>
    </section>

    <section>
        <div class="app_width">
            <div v-if="player.name == ''" class="create">
                <h3>Create Game Account</h3>

                <form>
                    <label for="name">Your Name</label>
                    <input type="text" v-model="player.name" id="name" required name="name" placeholder="John Doe">

                    <button class="button" type="submit">Create Game</button>
                </form>
            </div>

            <div class="play" v-else>
                <div class="profile">
                    <h3>Play Game</h3>

                    <div class="name">
                        <p>{{ player.name }}</p>
                        <span>{{ player.points }} points</span>
                    </div>
                </div>

                <Choice v-if="!cooldown" @userAction="sendUserAction"></Choice>
                <ColdownAnimation v-if="cooldown"></ColdownAnimation>
            </div>
        </div>
    </section>
</template>

<script setup>
import PrimaryButton from '../components/PrimaryButton.vue';
import ColdownAnimation from './components/ColdownAnimation.vue';
import Choice from './components/Choice.vue';
</script>

<script>
import { mapMutations } from "vuex";
export default {
    data() {
        return {
            cooldown: false,
            player: {
                name: "",
                points: 0
            }
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
.section_header {
    box-shadow: rgba(42, 23, 148, 0.15) 0px 48px 100px 0px;
}

.logo p {
    font-size: 40px;
    font-weight: 700;
    user-select: none;
    color: #000;
}

header {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.create,
.play {
    padding: 60px 0;
}

.create h3,
.play h3 {
    font-size: 30px;
    font-weight: 500;
}

form {
    display: flex;
    flex-direction: column;
}

input {
    height: 50px;
    padding: 20px;
    border-radius: 12px;
    margin-top: 6px;
    border: 1px solid #ccc;
    outline: none;
    font-size: 16px;
}

label {
    margin-top: 16px;
}

form .button {
    height: 50px;
    width: 200px;
    background: var(--pr);
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    border-radius: 12px;
    margin-top: 30px;
    cursor: pointer;
}

.profile {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.profile .name {
    display: flex;
    align-items: center;
    gap: 20px;
}

.name p {
    font-size: 18px;
    font-weight: 500;
}

.name span {
    padding: 4px 8px;
    border-radius: 6px;
    background: blue;
    color: #fff;
    font-size: 14px;
}
</style>