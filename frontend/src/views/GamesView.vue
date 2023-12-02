<template>
    <section>
        <div class="app_width">
            <main>
                <div class="title">
                    <h3>My Games</h3>

                    <RouterLink to="/games/create">
                        <PrimaryButton :text="'New Game'" />
                    </RouterLink>
                </div>

                <div class="games">
                    <RouterLink to="/games/1">
                        <div class="game">
                            <div class="plan">Starter</div>
                            <img src="https://media.gq-magazine.co.uk/photos/645b5c3c8223a5c3801b8b26/16:9/w_1280,c_limit/100-best-games-hp-b.jpg"
                                alt="">
                            <div class="text">
                                <p class="name">RockPaperScissors</p>
                                <p class="description">Just a game</p>
                            </div>
                        </div>
                    </RouterLink>

                    <RouterLink to="/games/2">
                        <div class="game">
                            <div class="plan">Starter</div>
                            <img src="https://media.gq-magazine.co.uk/photos/645b5c3c8223a5c3801b8b26/16:9/w_1280,c_limit/100-best-games-hp-b.jpg"
                                alt="">
                            <div class="text">
                                <p class="name">RockPaperScissors</p>
                                <p class="description">Just a game</p>
                            </div>
                        </div>
                    </RouterLink>
                </div>
            </main>
        </div>
    </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import PrimaryButton from '../components/PrimaryButton.vue';
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