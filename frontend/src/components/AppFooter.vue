<template>
    <section>
        <div class="app_width">
            <footer>
                <RouterLink to="/rockpaperscissors">
                    <PrimaryButton :text="'Play RockPaperScissors'" />
                </RouterLink>
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

footer {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>