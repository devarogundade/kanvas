<template>
    <section>
        <LoadingBox v-if="fetching" />

        <div class="wrapper">
            <div class="app_width" v-if="game">
                <main>
                    <div class="toolbars">
                        <RouterLink :to="`/games`">
                            <div class="toolbar">
                                <i class="fi fi-rr-arrow-left" style="color: black;"></i>
                                <img :src="game.avatar" alt="">
                                <h3>Templates for {{ game.name }}</h3>
                            </div>
                        </RouterLink>

                        <RouterLink :to="`/games/${$route.params.id}/template`">
                            <PrimaryButton :text="'New Template'" />
                        </RouterLink>
                    </div>

                    <div class="games">
                        <div class="game" v-for="template, index in game.templates" :key="index">
                            <div class="plan">Template Id: {{ index }}</div>
                            <img :src="template.templateUri" alt="">
                        </div>
                    </div>

                    <div class="empty" v-if="game.templates.length == 0">
                        <img src="/images/empty.png" alt="">
                        <p>No template found!</p>
                    </div>
                </main>
            </div>
        </div>
    </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import PrimaryButton from '../components/PrimaryButton.vue';
import LoadingBox from '../components/LoadingBox.vue';
</script>

<script>
import { fetchGame } from '../scripts/graph';
export default {
    data() {
        return {
            game: null,
            fetching: true,
        }
    },
    mounted() {
        this.getGame()
    },
    methods: {
        getGame: async function () {
            this.fetching = true
            this.game = await fetchGame(this.$route.params.id)
            this.fetching = false
        }
    }
}
</script>

<style scoped>
.wrapper {
    min-height: 80vh;
}

.toolbars {
    margin-top: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.toolbar {
    display: flex;
    align-items: center;
    gap: 20px;
}

.toolbar img {
    width: 50px;
    height: 40px;
    border-radius: 6px;
    object-fit: cover;
}

.toolbar h3 {
    font-size: 24px;
    color: var(--text-normal);
}

main {
    min-height: 800px;
}

.title h3 {
    font-size: 30px;
    font-weight: 500;
}

.games {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    margin-top: 30px;
}

.game {
    width: 350px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
}

.game .plan {
    position: absolute;
    top: 10px;
    right: 10px;
    background: var(--pr);
    padding: 4px 8px;
    font-size: 14px;
    color: #fff;
    border-radius: 12px;
}

.game img {
    height: 400px;
    width: 100%;
    object-fit: cover;
}
</style>