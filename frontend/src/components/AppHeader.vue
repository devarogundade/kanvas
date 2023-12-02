<template>
    <section>
        <div class="app_width">
            <header>
                <RouterLink to="/">
                    <div class="logo">
                        <p>Kanvas</p>
                    </div>
                </RouterLink>

                <div class="actions">
                    <RouterLink to="/games">
                        <PrimaryButton width="240px" text="Launch App" />
                    </RouterLink>
                </div>
            </header>
        </div>
    </section>
</template>

<script setup>
import { RouterLink } from "vue-router";
import PrimaryButton from "../components/PrimaryButton.vue"
</script>

<style scoped>
section {
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
</style>