<template>
    <section>
        <div class="app_width">
            <footer>
                <p>RockPaperScissors</p>
                <RouterLink to="/rockpaperscissors">
                    <PrimaryButton :text="'Play now'" />
                </RouterLink>
                <p>🪨 🧻 ✂️</p>
            </footer>
        </div>
    </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import PrimaryButton from './PrimaryButton.vue';
</script>

<style scoped>
section {
    background: #fff;
    border-top: 1px var(--pr) solid;
}

footer p {
    font-size: 16px;
    font-weight: 700;
}

footer {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;
}
</style>