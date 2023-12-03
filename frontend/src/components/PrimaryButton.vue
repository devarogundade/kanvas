<template>
    <button :type="type" ref="button" :class="`button ${state}`" :style="`width: ${width}; background: ${bg};`">
        <ProgressBoxWhite class="progress" v-if="progress" />
        <p v-else :style="`color: ${color};`">{{ text }}</p>
    </button>
</template>

<script setup>
import ProgressBoxWhite from './ProgressBoxWhite.vue';
</script >

<script>
export default {
    props: ['state', 'width', 'bg', 'progress', 'text', 'color', 'type'],
}
</script>

<style scoped>
.button {
    padding: 0 20px;
    max-width: 100%;
    height: 50px;
    background: var(--pr);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    transition: .2s;
}

.button:hover {
    transform: translateY(-2px);
}


p {
    color: white;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
}

.disable {
    cursor: not-allowed;
    background: grey;
}

.disable:hover {
    transform: translateY(0);
    animation: shake 0.82s cubic-bezier(.36, .07, .19, .97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
}

.disable p {
    color: var(--text-dimmed);
}

.progress {
    transform: scale(0.4, 0.4);
}
</style>