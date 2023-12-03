<template>
    <section>
        <LoadingBox v-if="fetching" />

        <div class="app_width">
            <main>
                <div class="title">
                    <h3>My Games</h3>

                    <RouterLink to="/games/create">
                        <PrimaryButton :text="'New Game'" />
                    </RouterLink>
                </div>

                <div class="games" v-if="!fetching">
                    <RouterLink v-for="game in games" :to="`/games/${game.gameId}`">
                        <div class="game">
                            <div class="plan">{{ plans[game.plan] }}</div>
                            <img :src="game.avatar" alt="">
                            <div class="text">
                                <p class="name">{{ game.name }}</p>
                                <p class="description">{{ game.description }}</p>
                            </div>
                        </div>
                    </RouterLink>
                </div>

                <div class="empty" v-if="!fetching && games.length == 0">
                    <img src="/images/empty.png" alt="">
                    <p>No game found!</p>
                </div>
            </main>
        </div>
    </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import PrimaryButton from '../components/PrimaryButton.vue';
import LoadingBox from '../components/LoadingBox.vue';
</script>

<script>
import { watchAccount } from '@wagmi/core'
import { fetchGames } from '../scripts/graph';
export default {
    data() {
        return {
            games: [],
            plans: ['', 'Starter', 'Business', 'Enterprise'],
            fetching: true
        }
    },

    mounted() {
        this.getGames()

        watchAccount((account) => {
            this.$store.commit('setWallet', account.address)
            this.getGames()
        })
    },

    methods: {
        getGames: async function () {
            this.fetching = true
            this.games = await fetchGames(this.$store.state.wallet)
            this.fetching = false
        }
    }
}
</script>

<style scoped>
main {
    padding: 60px 0;
    min-height: 800px;
}

.title {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.title h3 {
    font-size: 30px;
    font-weight: 500;
}

.games {
    gap: 30px;
    display: flex;
    flex-wrap: wrap;
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
    height: 240px;
    width: 100%;
    object-fit: cover;
}

.game .text {
    padding: 16px;
    padding-bottom: 30px;
    color: var(--text-normal);
}

.game .name {
    font-size: 20px;
    font-weight: 600;
}

.game .description {
    font-size: 16px;
    margin-top: 4px;
}
</style>